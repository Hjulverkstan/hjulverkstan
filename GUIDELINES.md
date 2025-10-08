# Guidelines

## Table of contents `📖`

* [Guidelines](#guidelines)
  * [Table of contents `📖`](#table-of-contents-)
  * [Principles `⛩️`](#principles-)
    * [Simplicity and coherence `🍇`](#simplicity-and-coherence-)
    * [Describe over instruct `🫵`](#describe-over-instruct-)
    * [Composition `🧱`](#composition-)
    * [Integrity and Flow `🌊`](#integrity-and-flow-)
  * [Git Strategy `🌳`](#git-strategy-)
  * [Rules `🛑`](#rules-)
    * [Code style `🎨`](#code-style-)
    * [Documentation `📘`](#documentation-)
    * [Graceful errors `💣`](#graceful-errors-)

## Principles `⛩️`

The following sections are largely inspired by functional programming and the UNIX philosophy. They are broken into sections to ease readability but are, in essence, overlapping principles.

> Note that while JavaScript can be bent to be purely functional, we value vanilla JavaScript (TypeScript in our case). Instead of piping, currying and other FP fancies, we want to keep the abstractions as few as possible for easier recognition regardless of developer background.

### Simplicity and coherence `🍇`

- **Simplicity is key**: Prioritize simple solutions when possible, it leads to clearer, more maintainable code that is easier to debug and extend. In other words, find the most straightforward approach that meets the needs of the system without adding unnecessary layers of complexity.
 
- **Coherent design patterns**: Consistent and unified patterns make a codebase predictable, easier to understand, and more efficient to work with. Before contributing, take the time to identify existing patterns that pertain to your area of contribution; any additions that have previous common ground should be made in the same style. In many cases general coherency is better than "improving" just a single part. If refactoring is required, a plan should be in place as to how all pieces of the same pattern are to be upgraded.
 
- **Simple + coherent = clarity**: By keeping both simplicity and coherence in mind, the result clear code that is straightforward to understand. When the design is simple and the patterns are consistent, the purpose of the code is immediately apparent, reducing confusion and speeding up development.
 
- **Dumb = smart**: Repetitive code, when simple is often more maintainable and understandable than complex abstractions. While DRY (Don’t Repeat Yourself) is valuable, avoid sacrificing clarity for abstraction, i.e., over-engineering. A bit of boilerplate is often worth the trade-off for readability and long-term maintainability.

### Describe over instruct `🫵`
- **Declarative over imperative**. Declarative programming focuses on describing what the desired outcome is, while imperative programming defines how to achieve it through explicit step-by-step instructions. Favoring declarative approaches, simplifies code by abstracting away implementation details, making it more readable, easier to maintain, and less error-prone, as it reduces the need to manage control flow and state manually. This principle can apply to various levels or development, however, built JavaScript and Java some concrete helpers for achieving this:
    - Chainable methods like: map, filter, reduce, some, every are more declarative then manually mutating variables through for loops.
    - Ternary operators, when not too complex, are more declarative than using if statements, especially if statements with variable mutations.
     
- **Data over logic**. Data should work for you. Sometimes restructuring state or data can reduce the need for logic. Using structured data to drive behavior is often more flexible, maintainable, and simpler then implementing logic into conditionals like if statements or switch cases. By representing decisions, rules, or operations as data (e.g., objects or arrays), the program becomes easier to extend and modify, requiring changes to the data rather than logic refactoring.

### Composition `🧱`

- **Favour pure functions**. When possible keep functions pure, i.e., always return the same result for the same input and retain from unneeded side effects, meaning mutations of external variables, data, or interactions with the outside world (like files, databases and other asynchronous activities). This leads to predictability, ease of testing, and reliability.
 
- **Decouple side effects**. 100% pure functions will hardly make a system. When side effects are needed, as they most often are, separate them from the pure logic. The intent of pure and impure tasks are different and benefit from being decoupled. Side effects often have logic for handling the nature of asynchronous operations, the safety of its execution and the storing results of various state. While derivation/transformation/mapping of state benefit from a declarative and unidirectional flow.
 
- **Keep code modular**, let each function do one thing and one thing well. Compose multiple functions together to create large programs.

### Integrity and Flow `🌊`

- **Single Source of Truth**: Avoid storing the same data in multiple places. Rather than duplicating data across different fields, components, databases or states, reference the original source when needed instead. This reduces redundancy but most importantly ensures that updates or changes propagate correctly, keeping data reliable and easy to maintain.
 
- **Data Normalization and Flat Structure**: Aim to keep data structures flat and normalized instead of nested. This approach simplifies access and manipulation, improving performance and maintainability. By organizing data in a way that avoids redundancy, you minimize duplication and optimize storage and retrieval.
 
- **Stateless Transformations and Aggregations**: When transformations, aggregations, or derived data are necessary, ensure these operations are stateless. Rather than storing multiple versions or derived copies of the same data, generate them as needed from the primary source, ensuring that the original data remains consistent and accurate.
 
- **Unidirectional Data Flow**: Maintain a unidirectional data flow, that is, data flows in a single direction from its source to the consumer. This principle helps avoid complex two-way data bindings, which can lead to hard-to-trace bugs and inconsistencies. Ensure that all data-driven logic adheres to this flow to simplify debugging and enhance clarity.

## Git Strategy `🌳`

We work with **trunk-based development**, a summary of our practices:

- **Single common branch**. There is only one common branch, the trunk (`main`). Work is added here and is directly reflected to the development environment. No commits on main should break the system, all commits should be self-contained and working. Deployments to test / prod are made with tags.
 
- **Small chunks to main**. Keep our branches as short-lived as possible to minimize conflicts. 
 
- **Disciplined commits**. We keep our commits to one purpose only and explain that purpose as briefly as possible, e.g., we do not solve a bug and create a feature in the same commit unless it is the same solution in code. Different solutions may share the same branch but should be different commits. This reflects a disciplined way of developing. As we plan our work ahead, if I need to solve this issue first, then refactor this to then create my feature, then write the commits separately in that order.
 
- **Conventional commits**. The first line of the commit should be as brief as possible, in present tense, preferably 50 characters and never more than 72, follow the pattern `type(scope): Description` where the description is capitalized. Skip unnecessary wording like *add*, *in order to*, *adds a new feature*, etc...
    - **scope** is `web`, `api` or `cdk` depending on the area of work. If commits pertains to multiple areas, the scope may be skipped all togheter like `type: Description`
    - **type** is one of the following:
        - `feat` adds or remove a new feature. Write the implications of this feature in the first line instead of the technical solution if possible.
        - `fix` fixes a bug. Write the issue solved in the first line instead of the solution.
        - `refactor` rewrite/restructure your code, however, does not change any API behavior, that would likely be a `feat`.
        - `perf` commits for improving performance.
        - `style` does not affect the "compiled result" i.e., changing white-space, formatting, missing semicolons, etc...
        - `test` add missing tests or correcting existing tests.
        - `docs` affect documentation only.
        - `build` that affect build components like build tool/scripts, dependencies, project version, etc.
        - `ops` affect operational components like infrastructure, pipelines, deployment, backup, recovery, etc.
        - `chore` Miscellaneous commits not fitting into the previous tags. Examples can be modifying .gitignore, cleaning up unused files, etc...
   - Write a body for the commit (most often needed but not always) with one empty line after the first line consiting of:
     - What is done if it helps the effectivity of coming readers.
     - Why is it done if there is any motivation behind the work?
     - How it is done if the story is important.
     - Ending with `Solves #issue-number`
 
- **Always rebase**. We rebase main into our branch before creating a PR (`git pull origin main --rebase`), thus keeping our branch up to date but most importantly review our commits. Rebasing also allows us to restructure our commits so that we uphold the previously mentioned principles. Perhaps I need to reword something, or I deliberately made multiple commits that were intended to be squashed. It is good practice to commit `wip` commits at the end of the day or throughout the steps of your work as you can rebase them to perfection later on.
 
- **PR your self first**. Before creating a pull request, peer reviews yourself first. Go through your commits and check EVERY line to make sure you stand by your work before another contributor reviews it and of course test it locally.
 
- **Feature or fix branches**. We work in branches named either `feature/lower-case-dash-separated-name` or `fix/describe-the-problem`.

## Rules `🛑`

### Code style `🎨`

Use linting and prettifying to ensure code style. This is set up for our TypeScript directories and connected to our pre-commit hook. For setting up git hooks and your IDE see [SETUP.md](/setup.md).

### Documentation `📘`

- **Self documenting code**. Use documentation wisely, do not sprinkle with comments if the solution can be written in a self-explanatory way.

- **Document context**. Self-explanatory code is valued but a single line with the story behind a solution can greatly increase developer effectivity when otherwise required to jump through too many hoops to absorb the context.

- **Document decisions**. This applies to both an in code and architecture level. Implicit motivations deprives the project of its integrity. Decisions that affect the project ought to be documented. On an architectural level share it in the documentation, when a solution in code is likely to be criticized and overrun, document the motivation behind it.

- **Document references**. Functions intended to be reused should have some JavaDoc / TSDoc written for it. In TypeScript though, writing prameters and return values can be redundant as we rely on intellisence support of comments in interfaces and arguments. React components are a good example of this, better to add a comment to the props interface than write a TSDoc parameter breakdown. Add examples when needed. By using the built-in documentation support of our IDEs we can keep documentation about our functions in code rather than documenting them externally.

###  Graceful errors `💣`

Taken from *Tim Peters* the python legend:

- **Never fail silently**, code should never fail without notice unless specifically told so

- **Always gracefully fail**, code that fails should be gracefully handled. Does it need to break the whole runtime?
