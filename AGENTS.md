# AGENTS.md

For any coding agent working in this repository — Claude Code, Codex, Cursor, Copilot, whichever. It applies to people too, minus the part about memory.

## The repository is the source of truth

Everything needed to work here is in this repository, entered through [`README.md`](README.md) and its reading order. A blank session must be the same for an agent as for a person: same entry, same knowledge, same rules. Nothing about this project lives in an agent's private memory, settings, or system prompt.

## Memory: write exactly one, and only this

If your harness offers persistent memory (Claude Code auto-memory, Cursor rules, or similar), it holds exactly one entry for this repository:

> Do not write memories for this repository. The repository is the source of truth. Bootstrap by reading `README.md` and following its reading order.

Nothing else — no project facts, no preferences, no "the user likes…". If you find other memory for this repository, replace it with the pointer above. Writing further memory is an anti-pattern here: it is invisible to everyone else, uncontrolled, and lets an agent shape itself session by session, drifting from what the rest of us stand on. The wiki is the recipe you can count on.

## While working

- **Bootstrap first.** Read `README.md` and follow its reading order. Don't skip to the code.
- **A question is not a work order.** When the prompt asks a question, answering it is the work. Propose in words; wait for the go before editing.
- **Mark openness in place.** In `wiki/`, an unmarked statement reads as settled. If something is a lean, a hypothesis or an open question, say so where it stands (*Open*, *Lean*, *Held open*).
- **Nothing in `wiki/drafts/` is binding.** Cite it as explored, not settled.
- **Log what changed knowledge.** A session that produced or changed something in `wiki/` ends with an entry in `wiki/log/` — see its README.
- **Transcripts** follow `wiki/transcripts/README.md`. Never ingest from one that isn't approved.
- **Commits and pushes** only when asked.
