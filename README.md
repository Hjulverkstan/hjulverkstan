![Hjulverkstan header"](https://raw.githubusercontent.com/Hjulverkstan/.github/images/hjulverkstan-banner.png)


> This readme is in its early stages.

##Deploy new Code base

Copy Docker,docker-compose.yml and .env file to EC2 instance
--Copy using putty to EC2 instance and execute following command after connection through Ec2
-- Login to EC2 instance using Putty (ec-putty-key will be used for connection)
-- Select ec2-user
--docker-compose build
--docker-compose up -d
--Verified end point here
http://www.api.dev.hjulverkstan.org:8080/api/swagger-ui/index.html#/vehicle-controller/getAllVehicles
--Docker structure can be seen in main/docker-compose 
Note: When you restart EC2 server then you need to run docker-compose steps above

## Local development

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

## Guide lines

### 1. Code style

Use linting and prettifying to ensure code style.

### 2. Functional principles

We are aligned with the principles from functional programming:

- **Disiplined state**
  - One source of truth
  - Flat rather than nested
- **Immutable over mutable**
- **Pure functions, decoupled side effects and functional composition**
  - Keep functions pure as much as possible.
  - Abstract just the sideeffects seperately to be decoupled (safely).
  - Keep code modular, let each function do one thing and one thing well. Compose multiple functions together to create large programs.
- **Declarative over imperative**
  - Utilise map, filter, reduce, some, every over loops, if statements and variable mutation
  - Use ternaries where implementation can be simple enough over if statements and returns.
  - Data is better than logic
    - Make the data work for you, for instance instead of a function of if statements (or switch) make data that you can map / iterate over.

### 3. Simplicity and coherence

- **Simplicity is key**, while complex is better than complicated we value simple solutions.
- **Coherent design patterns**, unifying your approach to common solutions. The least suprises is the most fun!
- **Simple + coherent = clariy**
- **Dumb = smart**, we like dumb code. While we value DRY, we like to keep it simple. A bit of boilerplate can be easier to understand that an ansbtraction on it. 

### 4. Document

- **Self documenting code**
- **Document decisions** (ie. in the Readme or in code if it is about a local implementation)
- **Document references**, reusable functions should av JavaDoc / JSDoc. Write examples when needed

### 5. Graceful errors

- **Never fail silently**, code should never fail without notice unless specifically told so
- **Always gracefully fail**, code that fails should be gracefully handled. Does it need to break the whole runtime?

### 6. Git practices

- **Trunk based developement**, work in feature branches as small as possible. Master branch should always work.
- **Rebase over merging**, use rebase for merge/pull requests.
  - Rebase before peer review.
- **Small commits**, work in independent commits.
  - Structure and plan work work. Do you need to refactor? Do that first and sepperately. We values as few commits as possible but still splitting them up to seperate concern when possible. This refelcts a structured way of working.
- **Conventional commits**, commits follow a the conventional commits convention.
  - Message: type(scope): Message starts with captial letter an*d is written in prese~nt tense, preferable 50 characters, no more than 72.~*
    - scope: `web` (for web app) or `api` for backend
    - type:
      - `feat` adds or remove a new feature
      - `fix` fixes a bug
      - `refactor` rewrite/restructure your code, however does not change any API behaviour
      - `perf` special refactor commits, that improve performance
      - `style` do not affect the meaning (white-space, formatting, missing semi-colons, etc)
      - `test` add missing tests or correcting existing tests
      - `docs` affect documentation only
      - `build` that affect build components like build tool, ci pipeline, dependencies, project version, ...
      - `ops` affect operational components like infrastructure, deployment, backup, recovery, ...
      - `chore` Miscellaneous commits e.g. modifying .gitignore
  - Body:
     - **What** is done
     - **Why** is it done
     - **How** is it done
     - **Ref** issue reference number for Jira






