---
under: the rule
kind: brief
---

# The web's path

The web, the public site and the portal, is built into a folder of plain files and copied to storage that serves them. Unlike the API it cannot be renamed from one environment to the next, since the build writes in the environment's addresses and the site's content.

So each environment's web is built for it, and when only the content changes, a second workflow rebuilds it.

*Seen, in `stage-build-web.yml`, `stage-deploy-web.yml`, `publish.yml` and `web/src/server.tsx`; an agent's reading.*

## 1. Built into static files, with the content inside

The build does not only compile the code. It fetches the site's content from the environment's API and writes every page of the public site as finished HTML, so a visitor gets a page already written rather than one assembled in their browser. This is static site generation.

The build stage is the file `stage-build-web.yml`, which runs `npm run build` in `web/`. The environment's `VITE_` variables, the settings the web reads at build time, tell it which API to ask and give it a login for it. The content it fetches is what staff write in web edit, the part of the portal where the public site's text and images are edited.

The result is uploaded as an artifact named `web-dist`, a file GitHub keeps between the jobs of a run, for the deploy stage to pick up.

The build reads the content from the API that is running at that moment, and in `pipeline.yml` the web is built at the same time as the API is deployed, not after. So on a run that deploys both, the site is written from the API as it was before this deploy. That is harmless while the API's web edit endpoints stay the same, and it is recorded as [open](README.md#5-what-is-open).

*Seen, in `stage-build-web.yml`, `web/src/server.tsx` and the order of jobs in `pipeline.yml`; the consequence reasoned, not seen in a run, an agent's reading.*

## 2. Put in place on S3 and CloudFront

The deploy stage is the file `stage-deploy-web.yml`. It first writes a `version.json` into the files, saying the app's version and the commit it was built from. On dev the version is simply `dev`. Then it copies the files to the environment's S3 bucket, AWS's file storage, deleting whatever the new build no longer has.

Visitors do not reach the bucket directly but through CloudFront, AWS's network of caches around the world. A cache would go on serving the old site, so the last step tells CloudFront to forget everything it holds, in every environment whose CloudFront is named in its variables.

To see which version an environment runs, open `/version.json` on its site.

*Seen, in `stage-deploy-web.yml`; the last line reasoned from where the file is written, an agent's reading.*

## 3. Publish: rebuilding when only the content changed

An edit in the portal's web edit changes the database, not the site, since the site's pages were written at the last build. To show the edit, the site is rebuilt, and `publish.yml` does only that.

It is started by hand from the Actions tab, choosing the environment. It reads that environment's `version.json` straight from its bucket to find the commit it runs, builds the web again from that exact commit with the content as it is now, and deploys it with the same version. The code stays the same and only the content moves on.

*Seen, in `publish.yml`; that it is only started by hand is seen in that nothing in the repository starts it, an agent's reading.*
