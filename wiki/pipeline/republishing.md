---
under: the rule
kind: brief
---

# Republishing the website

A republish uses today's text and images, today's settings and today's workflow files, but the code its environment's website was last built from. It changes the website alone, leaves the API and its database as they are, and runs no check, since its code is not new.

![Two rows. Without a republish: staff edit in web edit, it is saved at once, and visitors still see the old site. With a republish: a developer runs Publish (web), the website is built again from the code running there with today's text and images, and the edit shows](.img/publish.svg)\
An edit is saved at once, but visitors see it only after a republish.

*Seen, in `publish.yml`, read 2026-10-05; not checked against a real run.*

## 1. How to republish

1. Open *Publish (web)* in GitHub's [Actions tab](basics/README.md#5-pipelines-on-github) and press *Run workflow*. Leave the branch as `main`, and choose the environment.

2. The run reads the environment's [`version.json`](delivering/web.md#3-which-website-version-is-running), a small file each delivery of the website leaves beside the site's files, to find the commit and version of the website running there.

3. It builds the website from that commit, and deploys it under the same version, by the same build and deploy stages a delivery uses.

The branch decides which workflow files run, which is why it is left as `main`.

A republish does not wait for a delivery running at the same time, as [runs do not wait for each other](delivering/README.md#15-runs-do-not-wait-for-each-other) says.

*Seen, in `publish.yml` and `stage-build-web.yml`.*

## 2. When it fails

A republish stops in its first job when it cannot learn what is running.

- If the environment's site has no `version.json`, fetching it fails with an error from S3, where the site's files are kept. Deliver the website to the environment once, then republish.

- If the file has no commit, or no version, the log says so and shows the file.

*Seen, in `publish.yml`.*
