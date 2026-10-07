# 2026-10-05 — The pipeline is rewritten as a sibling holon

The pipeline was rewritten from its contents, not from its existing pages, as a sibling holon, `wiki/pipeline-next/`, beside `wiki/pipeline/`. The old holon is untouched. Nothing is committed.

## What was decided, in session

- The top page gives the essence to everyone, coders or not, in one brief per part: checking, delivering, republishing. Each brief ends on a card, and the card's page gives what the deeper reading adds, without the YAML.

- Delivering breaks twice, into the API's path and the website's path. Checking and republishing break once.

- `in-practice/` dissolves. Each failure goes to the part where it happens, and each open fault is marked *Open* where it stands, instead of being listed apart.

- How to change the pipeline belongs in the general guide, general first and then ours. *Lean*, not yet written.

## How it was made

The author's direction came first, then a draft from the workflow files themselves. After that came about ten rounds. Each round had cold readers holding only the rule and the pages, and a fact-check against the source, until the cold readers' critique was down to words on five of the six pages.

## Found in the source, beyond what the old pages said

These are recorded as open in the pages. None is fixed.

- The API's only test makes sure it starts. The website's types are not checked. The check makes its database tables from the code, which no delivery does on an environment.

- No delivery changes the database's tables, since `ddl-auto` is `none` and there is no migration tool.

- The API's image has a health check, so the deploy does wait for health. The old pages said it did not.

- The API's login-signing key is written in `application.properties`, the same in every environment.

- The first-run fill in `data.sql` gives three accounts, all administrators, one shared known password.

- `cdk/README.md` gives the fill twice, with `update` and with `create`, and files `DEPLOY_API_SSH_HOST` as a secret where the deploy reads a variable.

- `GUIDELINES.md` names `release.yml`, old image tags, and examples of tags without the `v` that would start nothing.

- The website may be built while the API restarts, and then fails. Runs set no limit on overlapping.

## Left open

Saved at the author's request, to be revised another day, the first one foremost.

1. **How, or if, the new holon connects with *Pipelines in general*.** Today the new top page places `pipeline/basics/README.md` as a card and links its words inline, and the deep pages link into `basics/reading.md`. Whether the guide stays a card under the pipeline, becomes a sibling, or stands apart is undecided, and so is where it would live if `pipeline/` goes.

2. **Whether `pipeline-next/` replaces `pipeline/`**, and when; the wiki's entry places it only by a link, as a draft.

3. **How to change the pipeline.** *Lean:* in the general guide, general first and then ours, replacing `basics/ideas.md` and `in-practice/writing.md`. Not yet written.

4. **Sketches** for the new pages. None was drawn; the old SVGs were left behind with the old wording.

5. **Nothing was checked against a real run**, nor against the repository's settings on GitHub.

6. **The findings in the source**, listed above, wait on fixes in code or in the readmes they concern; the pages mark each *Open* where it stands.

## Files touched

- `wiki/pipeline-next/README.md`, `checking.md`, `republishing.md`, `delivering/README.md`, `delivering/api.md` and `delivering/web.md`, all new.

- This entry.
