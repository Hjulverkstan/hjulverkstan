---
under: the rule
kind: brief
---

![A browser window with a page in it](.img/web.svg)

# The website's path

Visitors should get a page at once, from anywhere. So each environment's website is built into finished files, from text the build fetches by signing in to that environment's API, and the files are served from caches near the visitor. A small file, `version.json`, is the only place that says which website an environment runs.

![Two rows and a line beneath. Build, once per environment: the code in web/ and text and image addresses from the API flow into npm run build, which gives finished files, pages already written. Deploy: the finished files, plus version.json, flow into an S3 bucket, then CloudFront, caches emptied each deploy, then a visitor. Beneath, the images, in their own S3 store, flow into CloudFront too, fetched by the visitor's browser and never built into the files](.img/web-path.svg)\
The build joins the code with the text from the API, and the deploy puts the result in storage behind caches. The images never enter the build: the browser fetches them from their own store, through the same caches.

*Seen, in `stage-build-web.yml` and `stage-deploy-web.yml`, read 2026-10-05; not checked against a real run.*

## 1. Built with its text inside

The build stage, `stage-build-web.yml`, runs `npm run build` in `web/`. It signs in to the environment's API, fetches the site's text and the addresses of its images, and writes a finished HTML file for every page (static site generation). The images themselves stay in a separate store for images in S3, AWS's file storage, and a visitor's browser fetches them from there, through the same caches as the site.

- A public page is written whole, its text and images' addresses included.

- A page of the portal, and the public page for a single vehicle, is written without what it shows, which the browser fetches when it opens, since these show live data. It still carries the site's text as it was at the build, as every page does.

The build reads the environment's `VITE_` settings: variables for the environment's name and addresses, and two secrets for the build's own account on the API. The account is needed because the API gives the site's text only to an account that has signed in.

The finished files are kept as an artifact named `web-dist`, which GitHub holds beside the run, and the deploy stage picks them up from there.

*Seen, in `stage-build-web.yml`, `web/src/server.tsx`, `web/scripts/build.js`, `web/src/root/index.tsx`, the API's `WebSecurityConfig.java` and `S3Service.java`, and `cdk/lib/app.ts`. That the two pages are written so because they show live data is reasoned.*

## 2. Deployed to storage behind caches

Visitors should always get the newest version. The files are kept in an S3 bucket, a store of its own in S3, and served through CloudFront, AWS's network of caches close to the visitor. The deploy stage, `stage-deploy-web.yml`, does three things:

1. It adds `version.json`, saying which version this is, the release's name or `dev`, and which commit it was built from.

2. It copies the files to the environment's S3 bucket, and deletes the files the new build no longer has.

3. It tells CloudFront to empty its caches, so visitors do not keep seeing the old site. Every environment has CloudFront, but the step is skipped if an environment's settings do not name it, and visitors may then keep seeing the old site for a while.

*Seen, in `stage-deploy-web.yml`, `pipeline.yml` and `cdk/lib/app.ts`; what visitors see when the step is skipped is reasoned.*

## 3. Which website version is running

The deploy puts `version.json` at the root of the site's S3 bucket. So it is one file, read at `/version.json` on an environment's site, and straight from the bucket by [republishing](../republishing.md). It names the website only: after a delivery of the API alone, it still names the last website built.

*Seen, in `stage-deploy-web.yml` and `publish.yml`; not tried on a live site.*
