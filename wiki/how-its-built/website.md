---
under: the rule
kind: brief
---

![A globe](.img/website.svg)

# The website

The website, in `web/`, is one React application written in TypeScript and built with Vite. It serves the public site and the portal in two different ways, because they need different things: the public site has to load fast and be found by search engines, and the portal has to show data as it changes.

The [website's readme](../../web/README.md) explains the website at length, with its shared table and form components, and the [React guidelines](../../web/GUIDELINES.md) say how components are written. Neither is yet brought into the wiki.

*Seen, in `web/`, read 2026-10-20.*

## 1. Two ways of serving pages

The public site is pre-rendered: built into finished pages before anyone visits. The portal is the opposite, an empty page that draws itself in the browser.

The build logs in to the API with a login of its own, fetches web edit's content for every language, and writes each page as a file, once per language under its own path, such as `/sv/…`, and once more at the root, with no language in the path. The cost is that a change made in web edit reaches visitors only when the site is built again, which the pipeline's [republishing](pipeline/republishing.md) does.

The portal fetches its data from the API while staff work. The public page for a single vehicle, such as a bike for rent, is drawn the same way, since it shows live data too.

*Seen, in `web/scripts/build.js`, `web/src/server.tsx` and `web/src/root/index.tsx`.*

### 1.1 Why no framework

The team built the pre-rendering itself, with React's own tools, rather than take on a framework such as Next.js, whose many breaking changes it judged a risk for a project meant to last. It is small: about a hundred lines when the team first tried it.

*Seen, in `web/README.md`; the reasoning and the hundred lines are the readme's.*

## 2. Three layers

A component asks a hook for what it needs, and the hook asks the layer that makes the request. Keeping these three layers apart is what keeps the components small.

Components draw the page and hold as little logic as they can. Hooks hold the state: what was fetched from the API, through TanStack Query, and which page the user is on, through React Router. The bottom layer defines each request to the API, with Axios.

*Seen, in `web/src/`.*

## 3. Folders by feature

The data side is split by feature, so the files for tickets, say, stand together in `web/src/data/ticket/`: its requests, its types, the hooks that read and change it, and its form, whose fields are checked with Zod.

The components stand apart, in `web/src/root/` for the pages and `web/src/components/` for what is shared. They are built with Tailwind for styles, components from shadcn built on Radix, and Tiptap for the rich text staff write in web edit.

*Seen, in `web/src/` and `web/package.json`.*

## 4. Text and languages

Text comes from two places. What staff write in web edit is kept by the API, in up to seven languages. The text of the website itself, its buttons and labels, is kept in the code, in Swedish and English, in `web/src/data/translations/`.

*Seen, in `web/src/data/translations/` and `Language.java`.*
