![Hjulverkstan header"](https://raw.githubusercontent.com/Hjulverkstan/.github/images/hjulverkstan-banner-api.png)

> Welcome to the back end module of the Hjulverkstan monorepo, here is a [link](../README.md) to the main project readme.

## UML Diagram

<div>
    <img src="hjulverkstan-uml-diagram.drawio.svg">
</div>

## Building with docker

This builds the spring application as a docker iamge with two tags, the env var DOCKER_API_IMAGE_TAG which by default after copying the .env.template to .env is `dev-release` and the commit hash of the current commit.

This is how the pipeline is going to build the image, for now if you have docker hub access run this with `--push` to publish. But can be used for local development as well since the to build and execute the `cdk/ec2-assets/docker-compose`. `TODO: Provide a more clear and documented approach to running locally using docker compose including the frontend as well...`


```bash
docker buildx build --platform linux/amd64,linux/arm64 \
  -t ${DOCKER_REPO}:$(git rev-parse --short=6 HEAD) \
  -t ${DOCKER_REPO}:${DOCKER_API_IMAGE_TAG} \
```
