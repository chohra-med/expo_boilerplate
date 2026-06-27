# Command: `tickets` — intake work as specs (MCP or inline plan)

> Turn work items into the SDD pipeline's fuel. Two sources, same output: a
> `specs/NNN-<slug>/` folder with a `spec.md` + `tasks.md` that `build` executes.
> You either **pull tickets from a ticket MCP** or **define a plan inline** — either way the
> AI works the resulting tasks under the harness (verifier + learning loop).

## Invocation
```
spec-harness tickets --mcp <server> [--query "<filter>"]   # pull from Linear / GitHub / Jira
spec-harness tickets --plan "<describe the work>"          # define inline, no ticket system
```
Or in Claude Code: `/spec-harness tickets`.

## Source A — a ticket MCP (Linear / GitHub Issues / Jira / …)
MCP-agnostic: works with any connected ticket server exposed via ToolSearch. The orchestrator:
1. **Discovers** the ticket tools (`ToolSearch "linear issues"` / `"github issues"` / `"jira"`).
2. **Lists** open tickets matching the query (assignee = me, label, milestone, sprint).
3. For each chosen ticket → **converts** it to `specs/NNN-<ticket-id>-<slug>/spec.md`:
   - the ticket title/body → the spec's "what" (testable acceptance criteria),
   - links back to the ticket URL/ID in the spec header (traceability),
   - then runs `plan` + `tasks` so it's build-ready.
4. On completion, optionally **writes status back** to the ticket (comment + close) if the MCP
   exposes a mutation and the human approved write-back.

> No ticket MCP connected? The command says so and falls back to Source B. It never invents a
> ticketing integration that isn't configured.

## Source B — an inline plan (no ticket system)
You describe the work in a sentence or a list. The orchestrator writes:
- `specs/NNN-<slug>/spec.md` — the "what" (testable),
- `specs/NNN-<slug>/plan.md` — the "how",
- `specs/NNN-<slug>/tasks.md` — atomic, ordered, testable units the AI will work through.

This is the "define them into a plan that the AI works on" path.

## Then: build
```
spec-harness build            # implement → test → VERIFY → review, one task at a time
```
Each ticket flows through the full harness. The verifier gates each; `learn` harvests the
lessons. A ticket isn't "done" until the verifier returns PASS against its acceptance criteria.

## Hard rules
- One ticket = one `specs/NNN-*/` folder = one verifiable end-state. No mega-specs.
- Acceptance criteria must be **checkable** (the verifier needs a PASS/FAIL target) — if a
  ticket is vague, sharpen it into testable criteria before planning.
- Never auto-close or comment on a ticket without explicit write-back approval.
- Never fabricate a ticket source; if the MCP isn't connected, use Source B and say so.
