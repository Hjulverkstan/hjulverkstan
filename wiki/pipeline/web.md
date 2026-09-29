---
under: the rule
kind: brief
---

# The web's path

The web is the public site and the portal that staff use. It is delivered as a folder of plain files that a browser can read directly. The API's image can move between environments, as [the API's path](api.md) shows, but the web's build cannot. The build writes the environment's addresses and the site's content into the files. So each environment gets its own build.

![Two rows. Build, once per environment: the code in web/ and content from the API both flow into npm run build, which gives finished files, pages already written. Deploy: the finished files, plus version.json, flow into an S3 bucket, the storage, then CloudFront, caches emptied each deploy, then a visitor](.img/web-path.svg)\
The build joins the code with the content. The deploy puts the result in storage on AWS, with caches in front of it, as §2 explains.

*An agent's reading of the workflow files, not checked against a real run.*

## 1. Built into finished pages

The build does more than compile the code. It asks the environment's API for the site's content, and writes every page of the public site as finished HTML. So a visitor gets a page that is already written. This is called static site generation.

The build stage is `stage-build-web.yml`, which runs `npm run build` in `web/`. The environment's `VITE_` variables are settings the web reads while it is built. They say which API to ask, and give a username and password to sign in. The content is what staff write in web edit, the part of the portal where the public site's text and images are edited.

The result is saved as an artifact named `web-dist`, a file GitHub keeps between the jobs of one run. The deploy stage picks it up from there.

The build reads from the API that is running at that moment. In a run, the web is built while the API deploys, not after. So when a run deploys both, the site is built from the old API. This is fine as long as the parts of the API that the build reads stay the same. It is listed as [open](open.md#3-the-web-may-read-an-old-api).

*Seen, in `stage-build-web.yml`, `web/src/server.tsx` and `pipeline.yml`. The effect is reasoned, not seen in a run.*

## 2. Deployed to S3 and CloudFront

The deploy stage, `stage-deploy-web.yml`, first adds a file `version.json`. It says the app's version and the commit it was built from. On dev the version is just `dev`. Then the deploy copies the files to the environment's S3 bucket, AWS's file storage. Files the new build no longer has are deleted.

Visitors do not reach the bucket directly. They go through CloudFront, AWS's network of caches around the world. A cache would keep showing the old site, so the last step tells CloudFront to empty its caches. This step is skipped if the environment has no CloudFront in its variables.

To see which version an environment runs, open `/version.json` on its site.

*Seen, in `stage-deploy-web.yml`. The last line is reasoned, not tried on a live site.*

## 3. Publish: rebuilding when only the content changed

An edit in web edit changes the database, not the site. The site's pages were written at the last build. To show the edit, the site must be built again, and `publish.yml` does only that.

You start it with the *Run workflow* button in the Actions tab, and choose the environment. It reads that environment's `version.json` from its bucket to find the commit. Then it builds the web again from that commit, with the newest content, and deploys it with the same version. The code stays the same. Only the content changes.

*Seen, in `publish.yml`. Nothing else in the repository starts it.*
