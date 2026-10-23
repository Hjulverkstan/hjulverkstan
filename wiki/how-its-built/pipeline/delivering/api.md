---
under: the rule
kind: brief
---

![Three containers stacked, ready to ship](.img/api.svg)

# The API's path

No server should have to build the API, and an image should say which code it holds. So each delivery builds the API into a [Docker image](../basics/README.md#4-from-code-to-a-running-program) named by its commit, and gives the image a name for its environment that the server follows.

*Seen, in `stage-build-api.yml` and `stage-deploy-api.yml`, read 2026-10-05; not checked against a real run. The why is reasoned, since the files do not say it.*

## 1. Built and named by its commit

The build stage, `stage-build-api.yml`, builds the image from `api/`, names it by the first six characters of its commit's id, more if six would be ambiguous, such as `:2b1618`, and uploads it to Docker Hub, where the images are kept.

That name is a Docker tag: a name that points to an image, as a label points to a box. A git tag names a commit, and a Docker tag names an image.

*Seen, in `stage-build-api.yml` and `pipeline.yml`.*

### 1.1 Every delivery builds its own image

A run that delivers the API builds its image anew, even for a release. So test and prod run an image built again from the same code, not dev's image passed on. The new image takes the same commit's tag, and that tag moves to it.

*Seen, in `pipeline.yml`; why a release does not reuse dev's image the files do not say. That the tag moves is reasoned from how Docker Hub treats an upload.*

## 2. Tagged for its environment

The deploy stage, `stage-deploy-api.yml`, first gives the image more Docker tags. A tag only points, so nothing is copied and nothing is rebuilt.

- If a release started the run, the image also gets the release's own tag, the same text as its git tag, such as `:v1.4.0-rc.1`.

- Every deploy then moves the environment's tag to the image: `dev-release`, `test-release` or `release`, from the environment's variable `DOCKER_API_IMAGE_TAG`. The server runs the image this tag points to, from the next time a deploy fetches it.

![Three names on the left, each with a note: :2b1618, named at build by its commit; :v1.2.0-rc.1, added when a release tag started the run; :test-release, the environment's name, moved on each deploy. Arrows from all three meet at one image, in Docker Hub, built from 2b1618. A note says test's server runs whatever :test-release points at](.img/image-names.svg)\
One image with three tags, after a release candidate is delivered to test. Only the environment's tag moves between images, and the server follows it.

The tag moves before the server is restarted. So if a deploy fails in between, the tag already points to the new image while the server still runs the old one.

*Seen, in `stage-deploy-api.yml`. The three tags are as `cdk/README.md` gives them, not checked on GitHub.*

## 3. The server

Each environment has one server, an EC2 machine rented from AWS. It runs the API beside its database and a backup, each as a container. The database is Postgres, with its data kept on the server, and the backup copies it to S3, AWS's file storage.

Docker compose runs the three from one file in `/opt/docker`, put there when the server was made. The pipeline never changes that file, as [what a delivery does not change](README.md#3-what-a-delivery-does-not-change) says. The backup's image is built on the server itself; the API's never is.

![On the left, GitHub Actions, which writes .env from the settings, and Docker Hub, which holds the images. An arrow labelled SSH: send .env, restart runs from GitHub Actions to the environment's server, an EC2 machine in /opt/docker. An arrow labelled pull runs from Docker Hub to the server's api. The server lists api, which runs the image its tag names; db, Postgres with its data kept on the server; and backup, which copies the database to S3](.img/server.svg)\
The settings come from the pipeline. The image comes from Docker Hub.

*Seen, in `cdk/assets-ec2/docker-compose.yml`, `cdk/lib/app.ts` and `stage-deploy-api.yml`.*

## 4. What a deploy does

After the tags, a deploy sends the server its settings and restarts its containers, so the API runs the image its environment's tag now points to.

1. It writes a `.env` file, one line per setting, from the environment's variables and secrets on GitHub, such as the database's password, and replaces the server's whole file with it.

2. It copies the file to the server over SSH, a secure login whose key is kept as a secret.

3. It takes all three containers down, fetches the API's and the database's images if they have changed, and starts the three again.

It then waits for the containers to run and for the API to report itself healthy, by a health check built into its image. That check asks every five seconds and gives up after twelve tries, about a minute, and the whole wait is cut off at two minutes. If it fails, the deploy prints what runs on the server and their last log lines, and fails.

So the API is offline from the stop until it reports itself healthy again. The database is offline only until its container starts again.

The database's image is named only `postgres:17`, so a deploy takes any newer version of Postgres 17 there is.

*Seen, in `stage-deploy-api.yml`, `api/Dockerfile` and `cdk/assets-ec2/docker-compose.yml`. How long the health check takes to give up is reasoned from Docker's documented behaviour. The database's moving release is open.*

## 5. Adding a setting the API needs

The deploy writes the `.env` file one named line at a time, rather than copying a file whole. So a new setting, such as a new address or key, reaches the API on the server only if it is added in the first two places below, and it belongs in the other three as well.

1. A variable or secret on GitHub, in all three environments: a secret if it must stay hidden, a variable if not.

2. The *Generate .env* step in `stage-deploy-api.yml`, which writes it to the server.

3. The application, in `api/src/main/resources/application.properties`, which reads it.

4. The [`.env.template`](../../../../.env.template), which developers copy to run the project locally.

5. If the API cannot start without it, the two places in `stage-test.yml` that start the API: for its tests, and for the website's part of the check.

Never write a secret in a workflow file or print it in a step. GitHub hides a secret in logs, but not a changed form of it.

*Reasoned, from where the current settings are; not tried with a new one. How GitHub hides secrets is from its documentation.*
