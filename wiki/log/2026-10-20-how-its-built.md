# 2026-10-20 — How it's built becomes the pipeline's parent

A new holon, `how-its-built/`, now stands in the wiki's entry where the pipeline stood. Its entry gives what Hjulverkstan's software is made of, where it runs, and how a change is made, for anyone at the top and for a developer beneath. The pipeline moved beneath it, whole, as the card that closes its last section. It was written on `feature/how-its-built`; nothing is committed.

## What was decided, in session

- **The name.** *How it's built*, chosen in session over *Engineer's perspective*, which would tell a reader who does not code that the page is not for them. Its top is for everyone, and it turns to engineering further down.

- **The pipeline moves beneath it**, as a placed part rather than a sibling. The folder was moved whole with `git mv`, and the eight links leaving it, all to the repository's readmes and `.env.template`, were rewritten one level deeper. The surface's check traced the whole wiki without a broken link or placement.

- **One home for the parts.** The pipeline's opening said what the website and the API are; it now says so in one sentence and points up to the parent. Its environments paragraph stays, with its sketch, since what updates each environment is the pipeline's.

- **The repository's readmes stay where they are, for now.** Each section links the readme that holds its detail, and says it is not yet brought into the wiki, as the rule allows for a source not yet digested. The sections hold only what was checked against the code.

- **The pipeline's card closes *Changing it*** rather than standing under a heading of its own, after the surface's check found the heading repeating the card's title.

- **A sketch** of one environment seen from a browser: one address, and the three parts it sends a request to. Drawn with the sketching tool; its labels use only words the top gives.

## Rounds

Seven rounds, each with a fresh head reading cold against the rule, and the first six with a second checking every claim against the code. What they changed:

- **The ground came first.** Web edit, tickets, the pipeline, and the difference between a user and an employee were each used before they were given, and now come first.

- **The `/v1` in the API's paths** took three rounds to settle. The API's paths start with `/v1/api/`, a browser asks for `/api/…`, and CloudFront, or the website's development server, adds the `/v1`. That is now said once, in *Where it runs*. The API's list of its requests has no `/v1`, so it is out of reach through an environment's address. That is reasoned, not tried.

- **Facts the readmes have wrong, or that the first draft had wrong**, as the code shows. The text message is sent when staff confirm a completed repair, not merely possible. A path the edge function does not know falls back to the nearest page above it, not to the portal. One public page, a single vehicle, is drawn in the browser. The tables are made by two settings set by hand for one start, and no tool manages them. The API needs no AWS keys on the server, since the server's role allows it, and it does not read the keys `.env.template` names at all.

- **Faces.** *Where it runs* and *Inside the website* opened on a vendor's name and a map of parts. They now open on the understanding.

The seventh round, the last the session allowed, found two small points. The out-of-reach list of requests was said twice, once without its grade. And the sketch showed no line from the API to the image store, which the caption said it writes to. Both were mended in place, and the rest of that round was words.

## Regrouped into cards

Read on the surface, the page was one long reading, too heavy to take in. It was regrouped the same day, as asked in session: the entry keeps the whole picture, the sketch and *Few, plain choices*, and places five parts as cards, in two sections. *What runs* holds `website.md`, `api.md` and `running.md`, and *Changing it* holds `working.md` and the pipeline.

The checked text was moved rather than written again. Each point that had shared a section with others got a section and a face of its own, and each new file a face that says whether to open it.

Two fresh heads read the regrouped holon. What they changed:

- **A lead that mapped the cards.** The entry's sentences around the cards described the layout and repeated the faces beneath them. They now say one understanding each, or nothing.

- **The `/v1` fact has one home**, in the API's page, where its requests are given; where it runs points there.

- **Copies across the boundary.** The pipeline's opening no longer gives the parts, and gives the environments by name only, pointing up to the entry for what each is.

- **Words before their ground across files.** The pipeline was named in a card's face before the entry gave it, and the build's own login before the API's page gave it. Both were reworded.

The second read found only small points, and they were mended in place. No round read the holon after that.

Files touched: `wiki/how-its-built/README.md`, `website.md`, `api.md`, `running.md`, `working.md` and `.img/parts.svg` (new); `wiki/pipeline/` moved to `wiki/how-its-built/pipeline/`, with the links leaving it rewritten, and its opening shortened to point up to the entry; `wiki/README.md`; and this entry.

## Graphics for its cards

Once `feature/build-wiki` was merged in, giving every other card a graphic, the five new cards got theirs, drawn in the same hand ([practice §8.7.1](../the-rule/poc/practice.md#871-the-graphic-is-drawn-in-one-hand-with-an-icon-beside-it)), each with its icon. The subjects were chosen in session, after a first set, a conceptual set and a set of bike parts were weighed: How it's built is Lego bricks, the parts snapped into one build; the website a globe; the API a plug about to meet its socket, the joint between the website and its data; where it runs a rack of three servers; working on it a keyboard with a wrench. Hands, a service bell and a gear were each tried for the API, and the plug, the first drawn, was kept. They are stand-ins by a session, as the others are.

A winding road was also tried for the pipeline's own graphic, and set aside; it keeps the pipe with a valve from [the card graphics](2026-10-20-card-graphics.md).

## Left open

1. **The readmes are not yet brought in.** `web/README.md`, `web/GUIDELINES.md`, `api/README.md`, `cdk/README.md`, `SETUP.md` and `GUIDELINES.md` each want reading against the code and bringing into the holon, one at a time. Some are out of date: the setup guide asks for PostgreSQL 14 while the servers run 17, and says to fill in AWS keys the API never reads.

2. **Dev's and test's addresses** are set when CDK is run and were not looked up. The infrastructure readme names one `staging.hjulverkstan.se`, and the guidelines say `test`.

3. **The sketching tool cannot look at a sketch drawn under the rule as it now stands.** The palette's newer colours carry a `calc()` inside `oklch()`, which `look` does not convert, so resvg drops every stroke rule and draws the lines solid black. The sketch here was looked at through a scratch copy with the `calc()` flattened; the committed file is as `new` wrote it. That is the rule's tool, and is noted here, not raised there.

4. **Whether the API's list of requests can be reached through an environment's address** is reasoned from the path, and wants one try.

5. **No round read the page after the seventh's mends.** An eighth fresh head would confirm that only words remain.
