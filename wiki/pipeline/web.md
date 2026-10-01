---
under: the rule
kind: brief
---

# The web's path

Visitors should get Hjulverkstan's public site fast, with every page already written. So the web, the public site and the portal staff use, is built ahead of time into plain files, with its content inside. Because each build holds one environment's content and addresses, every environment gets its own build. Read on for what the build needs, why it may read an old API, and how the finished files reach visitors through AWS.

This is the opposite of the API, whose image moves between environments, as [the API's path](api.md) shows. It is also why an edit to the site's text only shows after the site is built again, which [republishing](publish.md) explains.

![Two rows. Build, once per environment: the code in web/ and content from the API both flow into npm run build, which gives finished files, pages already written. Deploy: the finished files, plus version.json, flow into an S3 bucket, the storage, then CloudFront, caches emptied each deploy, then a visitor](.img/web-path.svg)\
The build joins the code with the content. The deploy puts the result in storage on AWS, with caches in front of it, as §2 explains.

*An agent's reading of the workflow files, not checked against a real run.*

## 1. Built into finished pages

A visitor should get a page that is already written, not one their browser has to put together. So the build does more than compile the code: it asks the environment's API for the site's content, and writes every page of the public site as finished HTML. This is called static site generation.

*Seen, in `stage-build-web.yml` and `web/src/server.tsx`.*

### 1.1 What the build needs

The build needs to know which API to ask, and needs a login there, because the content is not in the code.

The build stage is `stage-build-web.yml`, which runs `npm run build` in `web/`. The environment's `VITE_` settings are read by the web while it is built. Its variables say which API to ask, and two secrets give a username and password to sign in. The content is what staff write in web edit, the part of the portal where the public site's text and images are edited.

The result is saved as an artifact named `web-dist`, a file GitHub keeps between the jobs of one run. The deploy stage picks it up from there.

*Seen, in `stage-build-web.yml` and `web/src/server.tsx`.*

### 1.2 It may read the old API

The build reads from the API that is running at that moment, and in a run that is not always the new one.

The web is built at the same time as the API is built and deployed, not after, as [inside one run](deliver.md#3-inside-one-run) shows. So when a run deploys both, the site is built from the old API. This is fine as long as the parts of the API that the build reads stay the same. It is listed as [open](open.md#1-the-web-may-read-an-old-api).

*Reasoned, from the order of jobs in `pipeline.yml`; not seen in a run.*

## 2. Deployed to S3 and CloudFront

Visitors everywhere should get the site quickly, and always the newest version. So the files are stored on AWS, Amazon's cloud, and served through caches close to the visitor, which are emptied on every deploy.

The deploy stage, `stage-deploy-web.yml`, first adds a file `version.json`. It says the app's version and the commit it was built from. On dev the version is just `dev`. Then the deploy copies the files to the environment's S3 bucket, AWS's file storage. Files the new build no longer has are deleted.

Visitors do not reach the bucket directly. They go through CloudFront, AWS's network of caches around the world. A cache would keep showing the old site, so the last step tells CloudFront to empty its caches. This step is skipped if the environment has no CloudFront in its variables.

To see which version an environment runs, open `/version.json` on its site.

*Seen, in `stage-deploy-web.yml`. The last line is reasoned, not tried on a live site.*
