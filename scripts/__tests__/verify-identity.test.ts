const childProcess = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const SCRIPT = path.join(__dirname, "..", "verify-identity.js");
const roots: string[] = [];

function writeFile(root: string, relativePath: string, contents: string): void {
  const target = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, contents);
}

function writeJson(root: string, relativePath: string, value: unknown): void {
  writeFile(root, relativePath, `${JSON.stringify(value, null, 2)}\n`);
}

function writeApp(root: string): void {
  writeJson(root, "app.json", {
    expo: {
      scheme: "buyer-app",
      ios: { bundleIdentifier: "com.buyer.app" },
      android: { package: "com.buyer.app" },
    },
  });
}

function writeFirebase(root: string, packageName = "com.buyer.app"): void {
  writeJson(root, "google-services.json", {
    project_info: { project_id: "buyer-project", project_number: "123" },
    client: [{ client_info: { android_client_info: { package_name: packageName } } }],
  });
  writeFile(
    root,
    "GoogleService-Info.plist",
    `<plist><dict><key>PROJECT_ID</key><string>buyer-project</string><key>GCM_SENDER_ID</key><string>123</string><key>BUNDLE_ID</key><string>com.buyer.app</string></dict></plist>`
  );
}

function fixture(): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "verify-identity-"));
  roots.push(root);
  writeApp(root);
  writeFirebase(root);
  return root;
}

function verify(root: string): { status: number | null; output: string } {
  const result = childProcess.spawnSync(process.execPath, [SCRIPT, "--root", root, "--template"], {
    encoding: "utf8",
  });
  return { status: result.status, output: `${result.stdout}${result.stderr}` };
}

afterEach(() => {
  while (roots.length > 0) fs.rmSync(roots.pop(), { recursive: true, force: true });
});

describe("verify-identity source and fixture contract", () => {
  it("passes when app.json is coherent and no native tree has been generated", () => {
    const result = verify(fixture());

    expect(result.status).toBe(0);
    expect(result.output).toContain("PASS  [url-scheme] app.json declares expo.scheme");
  });

  it("keeps a generated iOS scheme mismatch advisory and restores cleanly", () => {
    const root = fixture();
    writeFile(
      root,
      "ios/Buyer/Info.plist",
      "<plist><dict><key>CFBundleURLSchemes</key><array><string>wrong-scheme</string></array></dict></plist>"
    );

    const mismatched = verify(root);
    expect(mismatched.status).toBe(0);
    expect(mismatched.output).toContain("ADVISORY [url-scheme]");

    writeFile(
      root,
      "ios/Buyer/Info.plist",
      "<plist><dict><key>CFBundleURLSchemes</key><array><string>buyer-app</string></array></dict></plist>"
    );
    const restored = verify(root);
    expect(restored.status).toBe(0);
    expect(restored.output).not.toContain("ADVISORY [url-scheme]");
  });

  it("exits 2 when Firebase inputs are absent", () => {
    const root = fixture();
    fs.rmSync(path.join(root, "google-services.json"));
    fs.rmSync(path.join(root, "GoogleService-Info.plist"));

    const result = verify(root);
    expect(result.status).toBe(2);
    expect(result.output).toContain("BLOCKED  [firebase]");
  });

  it("exits 1 when a Firebase package does not match app.json", () => {
    const root = fixture();
    writeFirebase(root, "com.another.app");

    const result = verify(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain("does not match app.json");
  });

  it("exits 1 when a recorded parent identity remains in a swept source file", () => {
    const root = fixture();
    writeJson(root, ".init-parent-identity.json", {
      identity: { previousBundleId: "com.parent.app" },
    });
    writeFile(root, "src/features/auth/constants/index.ts", "export const inherited = 'com.parent.app';\n");

    const result = verify(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain('parent identity "previousBundleId" still present');
  });

  it("hard-fails an app.json missing its source scheme", () => {
    const root = fixture();
    writeJson(root, "app.json", {
      expo: {
        ios: { bundleIdentifier: "com.buyer.app" },
        android: { package: "com.buyer.app" },
      },
    });

    const result = verify(root);
    expect(result.status).toBe(1);
    expect(result.output).toContain("app.json is missing expo.scheme");
  });
});
