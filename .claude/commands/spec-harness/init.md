# Command: `init` — spec-driven bootstrap

> Stand up the whole system in a target project **from a goal**, not from a blank template.
> This is the "init function where we explain what we want to achieve": you hand it intent,
> it produces the memory bank + rules + agents + the first spec.

## Invocation
```
spec-harness install <path> new        <name>    # greenfield: scaffold from a goal
spec-harness install <path> integrate  <name>    # existing repo: add without clobbering
spec-harness init     <path> <name>               # greenfield only (full interview)
```
Or, in Claude Code: `/spec-harness:init` and answer the interview. `install` is the one entry
point for **both** "start a new project with it" and "integrate it into an existing one" — it
auto-detects the mode (`.git`/`package.json`/`pyproject` ⇒ integrate) and is idempotent.

## Step 1 — capture intent (the interview, one message)
Ask all of these up front; pre-fill any the brief/repo already answers, then confirm:
1. **Mode** — new (greenfield) or integrate (existing repo)? (auto-detected; confirm.)
2. **Project name + one-sentence purpose.**
3. **Stack** — language, framework, datastore, test runner, lint/format, typecheck command.
4. **Hard constraints** — perf, privacy, regulatory, "graders punish over-engineering", deadline.
5. **Existing entry point?** (`CLAUDE.md`/`AGENTS.md`/`.cursorrules` — merge, never overwrite.)
6. **Work intake** — where do tasks come from? A ticket MCP (Linear/GitHub/Jira — which?) or
   inline plans? (Configures the `tickets` command's default source.)
7. **Learning goals** — what should the human operator be levelling up on while this ships
   (e.g. "RN performance", "LangGraph", "SDD")? Seeds `learning/NOTES.md` so the loop's TEACH
   step targets real goals, not noise.
8. **Regression guards** — any code that must NOT be touched (auth overrides, hardened paths)?
   Captured into `AGENTS.md` as ratchet rules on day one.

If a brief/spec file is supplied (e.g. a decoded take-home), **read it and pre-fill** — don't
re-ask what the brief or the repo already answers. Integrate mode: also run `index` first so
the answers are grounded in the real code.

## Step 2 — scaffold (copy from `templates/`, fill the `{{...}}`)
```
<target>/
├── CLAUDE.md                 # entry point (mandatory startup sequence)
├── AGENTS.md                 # the ratchet (harness)
├── constitution.md           # SDD non-negotiables
├── .memory/                  # 9 tiered files (NOT gitignored)
├── ai_rules/
│   ├── globalRules.md  context_map.md  updated_rules.md
│   └── rules/{core,context_management,frequent_rules}.md   # frequent_rules = stack-specific
├── .claude/
│   ├── agents/               # 6 agents: researcher→planner→implementer→tester→verifier→reviewer
│   └── commands/spec-harness/ # the commands as slash-commands (incl. learn, tickets)
├── .memory/80-feedback.md    # the learning-loop inbox (feedback → rules)
├── learning/                 # the human side: NOTES.md + lessons/ (active recall)
├── specs/
│   ├── constitution.md
│   └── 000-<slug>/spec.md     # ← written FROM your goal (Step 4)
├── SPEC-HARNESS.md           # how this repo is wired (the integrate guide)
└── loop.sh  goal.md           # the autonomous runner (optional) + the verifiable end-state
```

## Step 3 — research the stack (this is the part SDD tools skip)
Spawn the **researcher** against the web + any local code for the *target stack's* best
practices, and write them into `ai_rules/rules/frequent_rules.md` as concrete, stack-correct
rules. Never copy the RN reference rules into a non-RN project (hard rule). Generate, don't copy.

## Step 4 — write the first spec FROM the goal
Run the `spec` command on the captured intent → `specs/000-<slug>/spec.md`. This is what makes
`init` spec-driven instead of template-driven: the project starts with a real, testable "what".

## Step 5 — verify the bootstrap
- Echo the file tree. List the 9 memory files + tier.
- Confirm `CLAUDE.md` names `frequent_rules.md` in the startup sequence (load-bearing rule).
- Confirm `goal.md` end-state is fully checkable (no "works well").
- Confirm no `{{...}}` placeholders remain. No `[TBD]` in `.memory/`.

## Hard rules
- Never Spec Harness-ify the second-brain vault itself.
- Never leave `{{...}}` / `[TBD]` after init — ask in Step 1 or fill from the brief.
- For graded/anonymized deliverables: add the Spec Harness scaffolding to `.gitignore`/zip-exclude so
  the shipped artifact stays clean (constitution art. 7).
