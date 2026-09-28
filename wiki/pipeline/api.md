---
under: the rule
kind: brief
---

# The API's path

The API is built into a Docker image, a sealed package of the Java application and everything it needs to run. The image is named by the commit it came from, and deploying means pointing the environment's name at an image and telling its server to run it. So the server never builds anything, and every environment runs an image built from the exact commit it was given.

*Seen, in `stage-build-api.yml` and `stage-deploy-api.yml`; an agent's reading.*

## 1. Built once per run, named by its commit

The build stage is the file `stage-build-api.yml`. It builds the image from `api/` and pushes it to Docker Hub, the registry our images are kept in, tagged with the first six characters of the commit hash, such as `:2b1618`.

It is built for both common kinds of processor, `amd64` and `arm64`. A build cache is kept both on GitHub and in the registry, so a build that changes little is fast.

*Seen, in `stage-build-api.yml`; an agent's reading.*

## 2. Promoted by renaming

The deploy stage is the file `stage-deploy-api.yml`, and before touching the server it gives the image more names. A Docker tag is only a name pointing at an image, so a new tag costs nothing and changes nothing inside it. It is not the git tag that starts a release, though a release gives the image a Docker tag of the same name.

- When a git tag started the run, the commit's image is also given the version as a Docker tag, such as `:v1.2.0`.

- Every deploy then points the environment's own tag at that image. The tag's name is the environment's variable `DOCKER_API_IMAGE_TAG`, and the server always runs whatever that tag points at.

A tag run builds the image for its commit again before promoting it, mostly from the cache, so the image in test or prod is built from the same code as the one that ran in dev, not copied from it.

*Seen, in both files; an agent's reading.*

## 3. Put in place on the server

Each environment has one server, an EC2 machine on AWS, which runs the API, its Postgres database and a backup job side by side. Docker compose is what runs them: one file lists the containers, and one command starts or stops them all. Their compose file and folder, `/opt/docker`, were put there when the server was made, and the pipeline does not change them.

What the pipeline sends is the configuration. It writes a `.env` file from the environment's variables and secrets on GitHub, the database password among them, and copies it to the server over SSH, a login to the machine with a key kept among those secrets. Then it stops docker compose and starts it again, which pulls the image the environment's tag now points at. The API is down for the moment between. If the containers do not start within two minutes, the step prints their state and logs and fails.

The `.env` is written line by line in the step, not copied whole. So a setting the API needs is added in four places: the application, the [`.env.template`](../../.env.template), the environment's variables on GitHub, and the step that writes `.env`.

*Seen, in `stage-deploy-api.yml`, `cdk/assets-ec2/docker-compose.yml` and `cdk/lib/app.ts`; the four places reasoned from them, an agent's reading.*
