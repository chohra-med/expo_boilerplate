#!/usr/bin/env node
/**
 * verify-identity.js — fail-loud proof that a fork no longer wears its parent's identity.
 *
 * Why this exists: a fork of this boilerplate reached a working end-to-end feature loop,
 * three merged PRs and a live backend while still carrying the parent's bundle id, the
 * parent's URL scheme and a THIRD app's Firebase project. Every test, lint and build stayed
 * green. Nothing in the repo could fail on it, so nothing did.
 *
 * Design decision (do not "simplify" this away): the parent's identity strings are NOT
 * hardcoded here. A hardcoded list rots the moment a new variant is cut. `init.js` records
 * the pre-init identity into `.init-parent-identity.json` (gitignored) BEFORE it rewrites
 * anything, and this script asserts the ABSENCE of exactly those strings. Self-configuring,
 * and correct for any future fork.
 *
 * Findings are reported by RECORD KEY + file:line, never by value — `iosGoogleClientId` and
 * the reversed client id are credential-adjacent.
 *
 * Usage:
 *   node scripts/verify-identity.js
 *   node scripts/verify-identity.js --root <dir> --record <path>
 *   node scripts/verify-identity.js --template        # this IS the template repo; skip absence sweep
 *   node scripts/verify-identity.js --auto            # --template ONLY if no record exists (yarn validate)
 *   node scripts/verify-identity.js --template-ref origin/development   # asset-hash fallback ref
 *
 * Exit 0 = clean. Exit 1 = at least one check RAN and FAILED. Exit 2 = at least one check
 * COULD NOT RUN (fail-closed: an unrunnable check is a failure, never a pass). When both are
 * present, 2 wins: a report with a hole in it is the more severe statement, because the checks
 * that could not run are exactly the ones nobody has looked at.
 *
 * Two behaviours here are DERIVED FROM THE TREE, not assumed:
 *   - The AUTH_SCHEME check is skipped as NOT APPLICABLE only when `AUTH_SCHEME` appears
 *     nowhere under `src/`. If it appears anywhere but the canonical constants file cannot be
 *     read, that is still a hole and still blocks. This variant does not define one.
 *   - There is no bootstrap script in this repo, so a missing parent record is cleared with
 *     `--template`, not by running an init command that does not exist here.
 */

const fs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");
const { execFileSync } = require("node:child_process");

const RECORD_FILENAME = ".init-parent-identity.json";
const DEFAULT_TEMPLATE_REF = "origin/development";

/** Assets actually DECLARED in app.json. Kept in one place so a new declaration is one edit. */
const DECLARED_ASSET_KEYS = [
  ["expo.ios.icon.light", (e) => e.ios?.icon?.light],
  ["expo.ios.icon.dark", (e) => e.ios?.icon?.dark],
  ["expo.ios.icon.tinted", (e) => e.ios?.icon?.tinted],
  ["expo.android.adaptiveIcon.foregroundImage", (e) => e.android?.adaptiveIcon?.foregroundImage],
  ["expo.android.adaptiveIcon.monochromeImage", (e) => e.android?.adaptiveIcon?.monochromeImage],
  ["expo.web.favicon", (e) => e.web?.favicon],
  ["expo.plugins[expo-splash-screen].image", (e) => findSplashPlugin(e)?.image],
  ["expo.plugins[expo-splash-screen].dark.image", (e) => findSplashPlugin(e)?.dark?.image],
];

function findSplashPlugin(expo) {
  const plugins = Array.isArray(expo.plugins) ? expo.plugins : [];
  for (const p of plugins) {
    if (Array.isArray(p) && p[0] === "expo-splash-screen") return p[1] || {};
  }
  return null;
}

// ---------------------------------------------------------------- arg parsing

function parseArgs(argv) {
  const args = {
    root: process.cwd(),
    template: false,
    auto: false,
    templateRef: DEFAULT_TEMPLATE_REF,
    record: null,
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--root") args.root = path.resolve(argv[++i]);
    else if (a === "--record") args.record = argv[++i];
    else if (a === "--template-ref") args.templateRef = argv[++i];
    else if (a === "--template") args.template = true;
    else if (a === "--auto") args.auto = true;
    else if (a === "--help" || a === "-h") args.help = true;
    else {
      console.error(`verify-identity: unknown argument "${a}"`);
      process.exit(2);
    }
  }
  if (!args.record) args.record = path.join(args.root, RECORD_FILENAME);
  // The template repo has no parent record and never will, so the absence sweep genuinely
  // cannot run THERE, and only there does this degrade to --template. A fork that recorded its
  // parent's identity into the record file before renaming itself gets the full sweep. This is
  // deliberately not a blanket --template: the positive checks still run in template mode, and
  // a Firebase/bundle-id mismatch still fails.
  if (args.auto && !args.template && !fs.existsSync(args.record)) args.template = true;
  return args;
}

// ---------------------------------------------------------------- reporting

const failures = [];
// A check that COULD NOT RUN is NOT a check that failed, and the difference is the exit code.
// `failures` = the input was there and the assertion is false. `blockers` = the input the check
// needed was absent or unreadable, so there is no verdict at all. See `blocked()`.
const blockers = [];
const passes = [];
const notes = [];

function fail(check, message) {
  failures.push({ check, message });
}
/**
 * The check could not run: a required artefact is missing, unparseable, or the baseline the
 * check compares against does not exist. Never a pass. Exits 2, and 2 outranks 1.
 *
 * The line: a file that parsed but lacks a FIELD is a `fail` (the subject is defective and we
 * can say so). A missing INSTRUMENT — the parent record, the template hash, the needle list —
 * is `blocked`, because without it the check measures nothing and would report green.
 */
function blocked(check, message) {
  blockers.push({ check, message });
}
function pass(check, message) {
  passes.push({ check, message });
}
function note(message) {
  notes.push(message);
}

// ---------------------------------------------------------------- fs helpers

const SKIP_DIR_NAMES = new Set([
  "node_modules",
  ".git",
  "build",
  ".gradle",
  ".cxx",
  "Pods",
  "DerivedData",
  "xcuserdata",
  ".expo",
  "coverage",
]);
const MAX_SCAN_BYTES = 2 * 1024 * 1024;

function walkFiles(dir, out = []) {
  let entries;
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return out;
  }
  for (const entry of entries) {
    if (entry.isSymbolicLink()) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (SKIP_DIR_NAMES.has(entry.name)) continue;
      walkFiles(full, out);
    } else if (entry.isFile()) {
      out.push(full);
    }
  }
  return out;
}

function readTextOrNull(file) {
  let stat;
  try {
    stat = fs.statSync(file);
  } catch {
    return null;
  }
  if (stat.size > MAX_SCAN_BYTES) return null;
  let buf;
  try {
    buf = fs.readFileSync(file);
  } catch {
    return null;
  }
  if (buf.includes(0)) return null; // binary
  return buf.toString("utf8");
}

function sha256(file) {
  return crypto.createHash("sha256").update(fs.readFileSync(file)).digest("hex");
}

/** Does this variant use an AUTH_SCHEME at all? Derived from src/, never hardcoded. */
function usesAuthScheme(root) {
  const src = path.join(root, "src");
  if (!fs.existsSync(src)) return false;
  for (const file of walkFiles(src)) {
    const text = readTextOrNull(file);
    if (text !== null && text.includes("AUTH_SCHEME")) return true;
  }
  return false;
}

function plistValue(text, key) {
  // <key>NAME</key> followed by <string>VALUE</string>
  const re = new RegExp(`<key>${key}</key>\\s*<string>([^<]*)</string>`);
  const m = text.match(re);
  return m ? m[1] : null;
}

// ---------------------------------------------------------------- collectors

/** Every Firebase config file in the tree: the committed root pair plus the prebuilt native copies. */
function findFirebaseConfigs(root) {
  const found = [];
  const candidates = [
    path.join(root, "google-services.json"),
    path.join(root, "GoogleService-Info.plist"),
  ];
  for (const dirName of ["android", "ios"]) {
    const dir = path.join(root, dirName);
    if (!fs.existsSync(dir)) continue;
    for (const f of walkFiles(dir)) {
      const base = path.basename(f);
      if (base === "google-services.json" || base === "GoogleService-Info.plist")
        candidates.push(f);
    }
  }
  for (const c of candidates) {
    if (!fs.existsSync(c)) continue;
    if (found.some((f) => f.file === c)) continue;
    const text = readTextOrNull(c);
    if (text === null) continue;
    if (c.endsWith(".json")) {
      let json;
      try {
        json = JSON.parse(text);
      } catch (e) {
        blocked(
          "firebase",
          `${path.relative(root, c)} is not valid JSON: ${e.message} — this config cannot be compared to app.json`
        );
        continue;
      }
      found.push({
        file: c,
        kind: "android",
        projectId: json.project_info?.project_id ?? null,
        projectNumber: json.project_info?.project_number ?? null,
        packageNames: (json.client || [])
          .map((cl) => cl.client_info?.android_client_info?.package_name)
          .filter(Boolean),
      });
    } else {
      found.push({
        file: c,
        kind: "ios",
        projectId: plistValue(text, "PROJECT_ID"),
        projectNumber: plistValue(text, "GCM_SENDER_ID"),
        packageNames: [plistValue(text, "BUNDLE_ID")].filter(Boolean),
      });
    }
  }
  return found;
}

/** Files the absence sweep must cover. A checker that only read app.json would have PASSED the broken tree. */
function sweepTargets(root) {
  const targets = [];
  const explicit = [
    "app.json",
    "google-services.json",
    "GoogleService-Info.plist",
    path.join("src", "features", "auth", "constants", "index.ts"),
  ];
  for (const rel of explicit) {
    const full = path.join(root, rel);
    if (fs.existsSync(full)) targets.push(full);
    else note(`absence sweep: ${rel} not present, skipped`);
  }
  for (const dirName of ["android", "ios"]) {
    const dir = path.join(root, dirName);
    if (!fs.existsSync(dir)) {
      note(`absence sweep: ${dirName}/ not present (generated by expo prebuild), skipped`);
      continue;
    }
    targets.push(...walkFiles(dir));
  }
  return [...new Set(targets)];
}

// ---------------------------------------------------------------- the checks

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    console.log(fs.readFileSync(__filename, "utf8").split("*/")[0]);
    process.exit(0);
  }
  const root = args.root;

  // --- C1: app.json is readable and declares an identity -------------------
  const appJsonPath = path.join(root, "app.json");
  if (!fs.existsSync(appJsonPath)) {
    console.error(`verify-identity: app.json not found at ${appJsonPath}`);
    process.exit(2);
  }
  let expo;
  try {
    expo = JSON.parse(fs.readFileSync(appJsonPath, "utf8")).expo;
  } catch (e) {
    console.error(`verify-identity: app.json is not valid JSON: ${e.message}`);
    process.exit(2);
  }
  const scheme = expo?.scheme;
  const bundleId = expo?.ios?.bundleIdentifier;
  const androidPackage = expo?.android?.package;
  for (const [label, value] of [
    ["expo.scheme", scheme],
    ["expo.ios.bundleIdentifier", bundleId],
    ["expo.android.package", androidPackage],
  ]) {
    if (!value) fail("identity", `app.json is missing ${label}`);
  }
  if (scheme && bundleId && androidPackage) {
    pass("identity", `app.json declares scheme, ios bundle id and android package`);
  }
  if (bundleId && androidPackage && bundleId !== androidPackage) {
    note(`app.json ios.bundleIdentifier and android.package differ (that is legal, just unusual)`);
  }

  // --- C2: AUTH_SCHEME equals app.json's scheme ----------------------------
  const authConstPath = path.join(root, "src", "features", "auth", "constants", "index.ts");
  const authText = readTextOrNull(authConstPath);
  if (authText === null && !usesAuthScheme(root)) {
    // Not a hole: this variant declares no AUTH_SCHEME anywhere under src/, so there is nothing
    // to compare. Derived by sweeping src/, never assumed — the moment one appears, the branch
    // below takes over and a missing constants file blocks again.
    note(`AUTH_SCHEME is not used anywhere under src/ — scheme cross-check not applicable here`);
  } else if (authText === null) {
    blocked(
      "auth-scheme",
      `cannot read ${path.relative(root, authConstPath)} — AUTH_SCHEME cannot be compared to app.json`
    );
  } else {
    const m = authText.match(/export const AUTH_SCHEME\s*=\s*["'`]([^"'`]*)["'`]/);
    if (!m) {
      fail("auth-scheme", `AUTH_SCHEME not found in src/features/auth/constants/index.ts`);
    } else if (m[1] !== scheme) {
      fail(
        "auth-scheme",
        `AUTH_SCHEME does not equal app.json expo.scheme — OAuth redirects will break ` +
          `(src/features/auth/constants/index.ts vs app.json)`
      );
    } else {
      pass("auth-scheme", `AUTH_SCHEME equals app.json expo.scheme`);
    }
  }

  // --- C3: the app's own URL scheme is registered in CFBundleURLSchemes -----
  const urlTypes = expo?.ios?.infoPlist?.CFBundleURLTypes || [];
  const allSchemes = urlTypes.flatMap((t) => t.CFBundleURLSchemes || []);
  if (!scheme) {
    // already failed in C1
  } else if (!allSchemes.includes(scheme)) {
    fail(
      "url-scheme",
      `app.json expo.ios.infoPlist.CFBundleURLTypes does not register expo.scheme — deep links will not open the app`
    );
  } else {
    pass("url-scheme", `expo.scheme is registered in CFBundleURLTypes`);
  }

  // --- C4/C5: Firebase configs agree with each other AND with app.json -----
  const configs = findFirebaseConfigs(root);
  if (configs.length === 0) {
    blocked(
      "firebase",
      `no google-services.json / GoogleService-Info.plist found — nothing to compare against app.json, ` +
        `and analytics cannot be attributed`
    );
  } else {
    const projectIds = [...new Set(configs.map((c) => c.projectId).filter(Boolean))];
    if (projectIds.length === 0) {
      fail("firebase", `no project id found in any Firebase config file`);
    } else if (projectIds.length > 1) {
      const where = configs.map((c) => path.relative(root, c.file)).join(", ");
      fail(
        "firebase",
        `Firebase config files disagree on the project id (${projectIds.length} distinct values across: ${where})`
      );
    } else {
      pass("firebase", `all ${configs.length} Firebase config file(s) name one project id`);
    }

    for (const cfg of configs) {
      const rel = path.relative(root, cfg.file);
      const expected = cfg.kind === "ios" ? bundleId : androidPackage;
      const label =
        cfg.kind === "ios" ? "BUNDLE_ID" : "client_info.android_client_info.package_name";
      if (!expected) continue;
      if (cfg.packageNames.length === 0) {
        fail("firebase", `${rel} declares no ${label}`);
      } else if (!cfg.packageNames.includes(expected)) {
        // THIS is the check that would have caught the three-way mismatch.
        fail(
          "firebase",
          `${rel}: ${label} does not match app.json (${cfg.kind === "ios" ? "expo.ios.bundleIdentifier" : "expo.android.package"}) ` +
            `— the app runs as one identity and reports as another`
        );
      } else {
        pass("firebase", `${rel}: ${label} matches app.json`);
      }
    }
  }

  // --- C6/C7: everything that needs the pre-init parent record -------------
  let record = null;
  if (fs.existsSync(args.record)) {
    try {
      record = JSON.parse(fs.readFileSync(args.record, "utf8"));
    } catch (e) {
      blocked(
        "parent-record",
        `${RECORD_FILENAME} is not valid JSON: ${e.message} — the absence sweep and the icon check CANNOT RUN`
      );
    }
  }

  if (!record && !args.template) {
    // Fail CLOSED. An unrunnable check is never a pass.
    blocked(
      "parent-record",
      `no ${RECORD_FILENAME} in ${root} — the absence sweep and the icon check CANNOT RUN. ` +
        `Write it before you rename anything (see the file's header for the shape), or pass ` +
        `--template if this IS the template repo and is meant to wear the template identity.`
    );
  }
  if (!record && args.template) {
    note(
      `--template given: absence sweep and icon check deliberately skipped (this tree IS the template)`
    );
  }

  if (record) {
    // --- C6: declared icons must NOT be byte-identical to the template's ---
    const parentHashes = record.assetHashes || {};
    const declared = [];
    for (const [label, get] of DECLARED_ASSET_KEYS) {
      const rel = get(expo);
      if (!rel) continue;
      declared.push({ label, rel: rel.replace(/^\.\//, "") });
    }
    const seen = new Set();
    let iconChecked = 0;
    for (const { label, rel } of declared) {
      if (seen.has(rel)) continue;
      seen.add(rel);
      const full = path.join(root, rel);
      if (!fs.existsSync(full)) {
        fail("assets", `${rel} is declared by ${label} but does not exist`);
        continue;
      }
      let parentHash = parentHashes[rel];
      if (!parentHash) parentHash = templateHashFromGit(root, args.templateRef, rel);
      if (!parentHash) {
        blocked(
          "assets",
          `no template hash for ${rel} (not in ${RECORD_FILENAME}, and \`git show ${args.templateRef}:${rel}\` failed) — cannot prove the icon was replaced`
        );
        continue;
      }
      iconChecked++;
      if (sha256(full) === parentHash) {
        fail(
          "assets",
          `${rel} is byte-identical to the template's — the fork would ship the parent's icon`
        );
      }
    }
    if (
      iconChecked > 0 &&
      !failures.some((f) => f.check === "assets") &&
      !blockers.some((b) => b.check === "assets")
    ) {
      pass("assets", `all ${iconChecked} declared image asset(s) differ from the template's`);
    }

    // --- C7: the parent's identity strings must be GONE -------------------
    const identity = record.identity || {};
    const wanted = [];
    for (const [key, value] of Object.entries(identity)) {
      if (typeof value !== "string") continue;
      const v = value.trim();
      if (v.length < 4) continue; // too short to be a meaningful needle
      wanted.push({ key, value: v });
    }
    if (wanted.length === 0) {
      blocked(
        "absence",
        `${RECORD_FILENAME} records no parent identity strings — the absence sweep would measure nothing`
      );
    } else {
      const targets = sweepTargets(root);
      const hits = [];
      for (const file of targets) {
        const text = readTextOrNull(file);
        if (text === null) continue;
        const lines = text.split("\n");
        for (const { key, value } of wanted) {
          if (!text.includes(value)) continue;
          for (let i = 0; i < lines.length; i++) {
            if (lines[i].includes(value)) {
              hits.push({ key, where: `${path.relative(root, file)}:${i + 1}` });
            }
          }
        }
      }
      if (hits.length > 0) {
        const byKey = new Map();
        for (const h of hits) {
          if (!byKey.has(h.key)) byKey.set(h.key, []);
          byKey.get(h.key).push(h.where);
        }
        for (const [key, wheres] of byKey) {
          // Report by RECORD KEY + file:line. Never by value — some of these are credentials.
          fail(
            "absence",
            `parent identity "${key}" still present at: ${wheres.slice(0, 12).join(", ")}` +
              (wheres.length > 12 ? ` (+${wheres.length - 12} more)` : "")
          );
        }
      } else {
        pass(
          "absence",
          `none of the ${wanted.length} recorded parent identity string(s) appear in ${targets.length} swept file(s)`
        );
      }
    }
  }

  // ---------------------------------------------------------------- output
  console.log("");
  console.log("identity verification");
  console.log("=====================");
  for (const p of passes) console.log(`  PASS  [${p.check}] ${p.message}`);
  for (const n of notes) console.log(`  note  ${n}`);
  for (const f of failures) console.log(`  FAIL  [${f.check}] ${f.message}`);
  for (const b of blockers) console.log(`  BLOCKED  [${b.check}] ${b.message}`);
  console.log("");
  if (blockers.length > 0) {
    console.log(
      `IDENTITY VERIFICATION INCOMPLETE — ${blockers.length} check(s) COULD NOT RUN` +
        (failures.length > 0 ? `, and ${failures.length} check(s) ran and FAILED` : "") +
        `. Exiting 2 because a check that cannot run is never a pass.`
    );
    console.log(`Clear the BLOCKED item(s) above so the report is complete, then re-run.`);
    process.exit(2);
  }
  if (failures.length > 0) {
    console.log(
      `IDENTITY VERIFICATION FAILED — ${failures.length} check(s) ran and FAILED. Exiting 1.`
    );
    console.log(`This fork would ship wearing another app's identity. Fix the above, then re-run.`);
    process.exit(1);
  }
  console.log(`identity verification passed (${passes.length} checks).`);
  process.exit(0);
}

function templateHashFromGit(root, ref, rel) {
  try {
    const buf = execFileSync("git", ["show", `${ref}:${rel}`], {
      cwd: root,
      maxBuffer: 64 * 1024 * 1024,
      stdio: ["ignore", "pipe", "ignore"],
    });
    return crypto.createHash("sha256").update(buf).digest("hex");
  } catch {
    return null;
  }
}

main();
