---
under: the rule
kind: brief
---

# The API's path

The API holds Hjulverkstan's data and rules, so its servers must only run code that anyone can trace back to the exact version it came from. That is why the API is delivered as a Docker image: the Java application packed with everything it needs, named by the commit it came from. The pipeline builds the image and tells each server which one to run.

So the server never builds anything itself, and an image runs the same on any machine.

*An agent's reading of the workflow files, not checked against a real run.*

## 1. Built and named by its commit

Naming each image by its commit means you can always see exactly which code a server runs. The build stage, `stage-build-api.yml`, builds the image from `api/`. It uploads the image to Docker Hub, where our images are stored. The image's name is the first six characters of its commit, such as `:2b1618`, so you can always see which code it holds.

A release tag builds the image again from its commit, instead of reusing the one dev ran. The new image gets the same name. The name then points to the new image. Both images are built from the same code.

*Seen, in `stage-build-api.yml` and `pipeline.yml`. That the name moves to the new image is reasoned from how Docker Hub handles an upload.*

## 2. Promoted by renaming

Deploying the API mostly means renaming, so nothing is copied or rebuilt on the server. The deploy stage, `stage-deploy-api.yml`, first gives the image more names. A Docker tag is only a name that points to an image, like a label on a box. Adding a label changes nothing inside the box.

![Three names on the left, each with a note: :2b1618, named at build by its commit; :v1.2.0-rc.1, added when a release tag started the run; :test-release, the environment's name, moved on each deploy. Arrows from all three meet at one image, in Docker Hub, built from 2b1618. A note says test's server runs whatever :test-release points at](.img/image-names.svg)\
One image with three names, after a release candidate is deployed to test. Only the last name moves between images, and the server follows it.

- If a git tag started the run, the image also gets the version as a name, such as `:v1.2.0-rc.1`. A git tag names a commit. A Docker tag names an image. Here they share the same text.

- Every deploy then moves the environment's own name to the image. That name is in the environment's variable `DOCKER_API_IMAGE_TAG`, such as `test-release`. The server always runs the image this name points to.

Renaming is fast, and it means the server runs exactly the image that was built in this run, nothing rebuilt on the way.

*Seen, in `stage-deploy-api.yml`. The names are as `cdk/README.md` gives them, not checked on GitHub.*

## 3. Deployed on the server

The server only ever receives two things: its settings from the pipeline, and the image from Docker Hub. So it never needs the code or any build tools. Each environment has one server, an EC2 machine: a server rented from AWS.

![On the left, GitHub Actions, which writes .env from the settings, and Docker Hub, which holds the images. An arrow labelled SSH: send .env, restart runs from GitHub Actions to the environment's server, an EC2 machine in /opt/docker. An arrow labelled pull runs from Docker Hub to the server's api. The server lists api, which runs the image its tag names; db, Postgres with its data kept on the server; and backup, which copies the database to S3](.img/server.svg)\
The settings come from the pipeline. The image comes from Docker Hub.

*Seen, in `stage-deploy-api.yml` and `cdk/lib/app.ts`.*

### 3.1 Three containers

The server runs the API beside its database and a backup, each as a container: one running copy of an image. Keeping them apart means each can be restarted or replaced without touching the others.

The three are the API, its database in Postgres (the database program), and a backup job that copies the database to S3, AWS's file storage. Docker compose runs them: one file on the server lists them, and one command starts or stops them all. That file is in `/opt/docker`. It was put there when the server was made, and the pipeline never changes it.

*Seen, in `cdk/assets-ec2/docker-compose.yml`; why they are kept apart is reasoned.*

### 3.2 What a deploy does

A deploy sends the server its settings, then restarts the containers so the API picks up the new image. It does three things:

1. It writes a `.env` file with the environment's [variables and secrets](basics/reading.md#5-environments-variables-and-secrets) from GitHub, such as the database password.

2. It copies the file to the server over SSH, a secure login with a key that is stored as a secret. Passwords live only in GitHub's secrets and on the server, never in the code, so anyone can read the code without seeing them.

3. It stops docker compose and starts it again. Docker then downloads the image the environment's name points to. The API is offline for a moment.

If the containers have not started after two minutes, the step shows their state and last log lines, and fails.

*Seen, in `stage-deploy-api.yml`.*

## 4. Adding a setting the API needs

A new setting for the API, such as a new address or key, must be added in five places, or the API on the server never gets it. This is because the deploy writes the `.env` file one line at a time, instead of copying it whole. The places are the code, the local template, GitHub, the deploy step and, sometimes, the tests:

1. The application, in `api/src/main/resources/application.properties`.

2. The [`.env.template`](../../.env.template), which developers copy to run the project locally.

3. The [variable or secret](basics/reading.md#5-environments-variables-and-secrets) on GitHub, in all three environments.

4. The *Generate .env* step in `stage-deploy-api.yml`.

5. If the API's tests need it, the test step in `stage-test.yml`, which gives the tests their own values.

*Reasoned, from where the current settings are. Not tried with a new setting.*
