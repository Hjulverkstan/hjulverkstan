# Setup local development

Run our setup shellscript to configure all git configs

```bash
sh ./setup.sh
```

Install Java JDK v21 from [JDK Archive](https://jdk.java.net/archive/).

Install [postgres](https://www.postgresql.org/download/) and create a user + database or use podman for containerisation (more performance heavy)

```bash
podman run --name postgresql -e POSTGRES_PASSWORD=pass -e POSTGRES_USER=hjulverkstan -d -p 5432:5432 -v pgdata:/var/lib/postgresql/data postgres:latest
```

Copy `main/env.properties.template` to `main/env.properties` and replace values if needed to match postgres setup.

Run backend in dev mode by setting up a SpringBoot run configuration in IDEA and go to options > add program arguments and paste in `-D spring-boot.run.profiles=dev`. Alternatively if you wan to run the backend from the terminal:

```bash
cd main
./mvnw spring-boot:run -D spring-boot.run.profiles=dev
```

If you encounter an issue with importing `env.properties` (happens to some people) then you may replace the first line of `main/src/main/resources/applicaiton.properties` with an absolute path to your `env.properties`, ie: ` spring.config.import=file:/path/to/git/repo/main/env.properties` (just make sure to not commit this change).

Run frontend in dev mode

```bash
cd web
npm run dev
```
