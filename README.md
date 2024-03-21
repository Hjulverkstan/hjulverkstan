# Hjulverkstan

<center style="margin-bottom:64px">
<div style="font-size: 80px">🚲</div>
<h1>Hjulverkstan</h1>
<p>Public website and internal administrator for the bike shop, integration focused project by Save The Children.</p>
<!-- <a href=""> -->
<!--  <img src="" /> -->
<!-- </a> -->
</center>

> This readme is work in progress, come back in a week for more goodies

## Local development

Run our setup shellscript to configure all git configs

```bash
sh ./setup.sh
```

Run a postgres server

```bash
podman run --name postgresql -e POSTGRES_PASSWORD=pass -d -p 5432:5432 -v pgdata:/var/lib/postgresql/data postgres:latest
```

Run backend in dev mode

```bash
cd main
./mvnw spring-boot:run -D spring-boot.run.profiles=dev
```

Run frontend in dev mode

```bash
cd web
npm run dev
```

## Decisions

- Minimal customisation for users, devs handle ENUMs
- No parts
- No reservations

- Requests
 - max 5 async requests
 - 1-2 no problem, 3 possible, 4 not good (dependent requests)

## Roadmap

### Overview

- User
  - Auth with username + pass over JWT with no passoword forgot or user create portal
  - CRUD for users by admins
- Tickets
  - Rental
  - Repair
  - In (donated)
  - Out (*sold*)
- CMS data
  - External table `{ key, values: { [lang]: string } }`
  - Internal table `{ localizationId, values: { [lang]: string } }`
  - Blog `{ [values]: localizationId }`
  - Events / courses `{ [values]: localizationId }`
  - Workshops (bike shops) `{ [values]: localizationId }`
- Get real
  - Domain
  - Server
  - Test pipelines
  - Deploy pipeline

### Timeline

- Finnish Miro UMLs
- Finnish current features
- Tickets
- Front end get started
- Get real
  - Domain
  - Server
  - Test pipelines
  - Deploy pipeline

- Unit tests backend
- Landing page

- Users + Auth

- CMS data
- More pages

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

### Backend specific

- REST
  - Return obj on POST
  - Mutations through one POST using props on json obj (not split different updated to different endpints for same entity)
  - GET uses json body instead of query params
- Type and optional properties over a relationship to a type in another table with properties in it

