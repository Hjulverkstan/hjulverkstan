# Hjulverkstan Web (Frontend)

## Prerequisites

Please complete prerequisite steps in [Getting Started Checklist](../README.md#getting-started) first.

The following dependencies are used, review these as needed before contributing.

- [React](react.dev)
- [Tanstack Query](anstack.com/query)
- [React Router](reactrouter.com)
- [Axios](axios-http.com)
- [Zod](zod.dev)
- [Vite](vite.dev)

## Background & Motivation

This application is a hybrid of SSG (Static Site Generation) and CSR / SPA (Client Side Rendering / Single Page Application).

The app has two primary goals:

1. Serve a public web-site (SSG is utilized – with localization support) for reaching the desired target group and build a presence on the web.
2. Serve the private web-app *Portal* (traditional CSR is utilized) to be used by employees for administrating operations och updating the public web-site.

> SSG is very similar to SSR in terms of technology, the difference is that SSR implies rendering the dom tree on every request from the client, on an application server, while SSG injects the dom tree into static files during the build process, often to be served from a file storage instead, e.g. AWS S3, Azure File Storage, GitHub Pages etc.

Since the React SSR api was released in *2014* the primary approach to SSR has been the through the framework [Next.js](nextjs-org), even referred to by React themselves in their own docs as the goto approach for server components. Some other established frameworks are [Astro](astro.build) and [Remix](remix.run).

This React app though, is founded without any such framework, for the reason that:

1. These frameworks (Next.js primarily) have taken many turns with breaking changes – resulting in a volatile development path. The JavaScript ecosystem tends to be volatile, the longer this project can be deemed healthy and stable, the better.
2. Simplicity is key, is it complex to do SSG oneself? We did a proof-of-concept before making a decision and the result was 100 lines of code. Great, skipping out on a large framework, does, in some aspects simplify things.

In short, all dependencies are marriages, and we deemed the projects future more stable without a framework. The effort of using the React SSR api together with Vite was concluded a simple enough task, to justify it framework-independence.

We will cover the architecture and how it works in the coming sections. First though, we will take a look at the SSG/CSR agnostic part of our React application.

## Three Layer Cake

Inspired by the [Guidelines' Principles](../GUIDELINES.md#principles-), this React application is split into three parts:

```
+------------------------------------------+
|                View Layer                |
|------------------------------------------|
| - Define and compose the component tree. |
| - Consume state from the Hooks layer.    |
+------------------------------------------+
                     |
+------------------------------------------+
|               Hooks Layer                |
|------------------------------------------|
| - Server state through Tanstack Query.   |
| - Navigation state with React Router.    |
| - Functional composition according to    |
|   Hook principles.                       |
+------------------------------------------+
                     |
+------------------------------------------+
|                API Layer                 |
|------------------------------------------|
| - Define requests using Axios.           |
| - Couple with unique cache keys.         |
| - Integrate typescript types.            |
| - Apply certain transformations.         |
+------------------------------------------+
```

Naturally it is about decoupling. Keeping the React components as free from stateful logic as possible means less component code and more focus on aspects of presentation in our components. Another point of this integration, utilizing [Tanstack Query](tanstack.com/query) and [React Router](reactrouter.com), so that all hooks can be used in however many components are needed, simultaneously, without causing duplicate requests. Resulting in smaller components, more gracefully decoupled from each other, as all of them can tap into the hooks layer as they like, ridding the component tree of unnecessarily passed props.

Another way to harmonize with this decoupling is to do, the often needed, *transformation* / *derivation* / *aggregation* of data from the server in the hooks layer instead of in components. Since hooks (and query hooks) can be functionally composed, one can make a `useBananas` hook, that is then used and transformed in a `usePeeledBanana` hook, that can then be aggregated with other hooks in a, say, `useFruitSalad` hook. Now, the component does not need to be concerned by salad mixing and fruit peeling, this is left for the Hooks layer to compose. Compositions of hooks is a craft that can save components from tiresome responsibility and is in many ways aligned with our [Guidelines' Principles](../GUIDELINES.md#principles-), and not to say, it is not fun. 

Quite technically there are various ways we compose TanStack's query hooks. The library has brought the functional direction of Reacts hooks a large step forward in its evolution and has presented an important perspective into what front end state implies:

> **TanStack Query Philosophy TLDR; The types of state**.
> 
> The majority of state in web apps of a CRUD nature (i.e. not media / game apps) is *server state*, and *server state* most often behaves the same way:
> 1. Is asynchronous and needs *loading* and *error* handling
> 2. Is not the source of truth, i.e. is stale and often needs to be re-fetched at some point.
> 3. May need pagination and other common mechanics.
> 4. Is used in various locations, often reusing one request in multiple places.
> 
> By encapsulating and decoupling this responsibility into a library, all we really need to provide is a request function and a key to store the result in the cache 👏.
>
> The next category of state that is of architectural importance, that is almost always prominent in CRUD apps, is *navigation state*. This we solve using React Router hooks.
> 
> And finally we have *presentational state*, i.e. state that is needed to do front end things like dropdowns, searchbars, multiselects, etc... This though pertains mostly to the View layer.

How to aggregate queries though is not quite discussed in the community of TanStack and becomes quite complicated if one wants to do proper functional composition. Since the result of a query hook is an object containing the data and all metadata about the request, if one wants to combine multiple query hooks in an aggregation and package the result to be returned by a new hook, what should that result be? There is now only one data value but multiple loading/error/etc fields...

Enter the [useAggregatedQueries](src/hooks/useAggregatedQueries.ts) hook, inspired by the [React Redux](react-redux.js.org) community's [Reselect](github.com/reduxjs/reselect) library, pass the hooks required, aggregate the data, purely, without concern for the metadata that is then merged together – from the consumer seen as just one query result.

```javascript
const useFruitSalad = useAggregatedQueries(
  (banana, misc, coconut) => [...banana, ...misc, ...coconut].sort(() => Math.random() - 0.5),
  [usePeeledBanana, useMiscFruits, useCoconutFlakes],
);
```

What about `usePeeledBanana`? That, in our example, does transformation on one hook only, `useBanana`. In this case we are currently sticking to the somewhat crude vanilla approach of the library, using the `select` property to transform data. This means that we duplicate a bit of code to create a `usePeeledBanana` hook, by copying the configuration of `useBanana` and adding the `select` prop for transformation. Like so:

```typescript
const useBanana = () => useQuery({
  ...fruitApi.createGetBanana(),
});

// While it could of reused the useBanana function we stick to the vanilla
// approach and redefine it with the select prop.
const usePeeledBanana = () => useQuery({
  ...fruitApi.createGetBanana(),
  select: banana => banana.sides.map(side => removePeel(side)),
});
```

> Another complexity with functional composition of TanStack Query hooks is that they also take objects as arguments, for instance the `enabled` field. These have to be manually connected when bundling multiple query hooks together.
>
> It would seem that TanStack Query does not have first class support for functional composition, though hooks in general in so many ways are.
> 
> While our application is not that complex in its use of TanStack Query and this topic is not of grave priority, here is one discussion on evolving query hooks for first class support in functional composition [#21](https://github.com/Hjulverkstan/hjulverkstan/issues/21).

You may find though, that some transformation of data is done in the Api layer. Why? Because sometimes non feature related transformation needs to be done, for instance, all ids from our requests are converted to strings. Doing this type of transformation in the lowest layer of *the cake* means our types for our data can have id's as strings. Something the rest of the application does not need to be concerned with.

## Directory Structure (by Features)

In broad terms there are two approaches to dividing application source code, most traditional is to do it by architectural concern, for instance:

```shell
- components
- hooks
- api
- types
- routes
- utils
```

While it is valuable to separate into concern, in practically if one is to develop on one specific feature, the files one touches is most often spread across all these directories. The alternative is to split into feature directories instead:

```shell
- features
  - fruits
    - api.ts
    - types.ts
    - components/
    - route.tsx
```

Some projects categorize like this, in our case we keep the view layer together but split the non-view related, aka data files into feature directories. Our structure looks like this:

```shell
- components/ # General components that are not tied to a specific route
  - shadcn/ # Components imported through shad-cn is place here
- data/
   - tickets/ # A feature, or rather a route in our application
     - api.ts # Api layer definitions
     - enums.ts # Described in sub section
     - form.ts # Described in sub section
     - mutations.ts # TanStack mutation hooks 
     - queries.ts # TanStack query hooks 
     - types.ts # Typings for data used
- hooks/ # General reusable hooks 
- root/ # Here the component tree is assembled in accordance to our front end guidelines (in terms on naming and directory patterns)

- utils.ts # Currently all general utils live in one file
- types.ts # Currently all general types live in one file
```

The ticket route in this case can import all the needed modules from the data / feature –directory:

```typescript
// root/Portal/PortalShopTickets/index.tsx

import { Ticket, TicketType } from '@data/ticket/types';
import { initTicket, ticketZ } from '@data/ticket/form';
import { useCreateTicketM, useEditTicketM } from '@data/ticket/mutations';
```

Let's go into some further detail regarding some directories:

### Enums.ts

This naming can be a little confusing so it important learn what these files are about. Throughout our application we use many enumerators fetched from the back end, some examples are:

- Ticket status
- Customer type
- Vehicle type

All these enumerators are defined in the `enums.ts` files in the different `data/` directories so we can add other needed fields to them that our application is in need of:

- `value`: Enum value – the raw value from the enumerator 
- `label`: Text label for the UI
- `icon`: Icon if there is one
- `variant`: Variant (i.e style, can determine color etc)

And one other filed: `dataKey` – this is the key, or field that this enumerator exists on, on the data in question, for vehicle type that is `vehicleType` as that is the prop on a `Vehicle` that it is mapped to. This is useful because many of our filters and dropdowns etc can use this data key to automatically read from or write to the data in question when the user takes action.

### Form.ts

Here we create two primary exports, in the example of `data/ticket/`:

- **initTicket**, this is where pre-filled fields are stored for create actions, e.g. arrays should be `[]` and not `undefined`.
- **ticketZ**, this is the [zod](zod.dev) schema used to validate create and edit actions on the client side.

## SSG Strategy

Now that we have covered the application structure it is time to look at the very root of the project. But first we'll iterate and clarify the purposes of the application.

### Public Web Site

The public site is static, that is, it is a bundle of html, css and javascript files served on an S3 bucket through CloudFront, a *Content Delivery Network*m, to the web.

This site is through the React SSR api, statically generated so that the dom tree is pre-populated within the render phase executed on upon build of the project. This improves loading times and SEO scoring.

Generic text like buttons are to be localized in the source code but all other content is provided by our backend, editable by the end user administrators in our `WebEdit` "sub app" of the `Portal`, in multiple languages. This data is requested once, during the build process and is then bundled together with the code so that is accessible directly in the client.

### Private Web App (the Portal)

The web app, named `Portal` is a traditional Client Side Rendered (CSR) React app. That is, the dom tree is not rendered during build time but commited by react once it is properly loaded in the browser. This is where TanStack Query is used mostly as all data is worked with immediately and directly in the Portal.

### The Build Process

When ever a release is made, the build script will create fresh build artifacts for deployment. However, when an end user admin wishes to publish changes made in `WebEdit` for the public website, let's say they have added a new event, what in fact is supposed to happen, is a trigger of the build script + deployment. Any new values in the database regarding the public website will then be used and bundled with the static release.

> This method is quite simple but also a bit crude, this way we dont need to create any abstractions in the database for releases, we just read the data and build the site when the publish button is pressed. However its simplicity is a bit unpolished. If a developer releases a new feature, any changes to the `WebEdit` data not yet published will then be bundled as well. An idea on how to solve this is discussed here [#31](https://github.com/Hjulverkstan/hjulverkstan/issues/31).

Let's start by with overview of the files concerning SSG:

```shell
- scripts/
  - build.js # Used to build the artifacts for deployment
  - dev.js # Used for local development
- src/
  - hooks/
    - usePreloadedData.tsx # This is the hook that is used to access data bundled during the build process.
  - root/
    - index.tsx # Here we assemble the routes and documents heads (Helmet)
  - client.tsx # Client side entry file
  - server.tsx # Server side entry file
```

Let's proceed by working bottom up, starting with the `build.js` file. It works like follows:

1. Iterate over `routesCSR` a definition of our CSR routes (currently only used for the portal app as it is the only CSR part of the app) from `root/index.tsx` and generate that index.html file to it's appropriate location. 

2. Call `getDataForPreloadingServerSide()` exported from `server.tsx`, this will make a request to our backend and retrieve all the dynamic data from `WebEdit`, for every localized language.

3. For every language, iterate over `routesSSR` (routes used by the public website) from `root/index.tsx` and generate index.html files in the correct directories to match the routes' paths. This is done by invoking `renderSSR` from `server.tsx` and rendering the result into the respective html files. Inject the data for this current iterated language as a JSON string into a script tag, declared to a variable on the window object, so that it can be accessed client side.

For more technical details check the source code.

This already covers most of what the SSG strategy is about, for local development `scripts/dev.js` is run instead, using pure SSR approach instead through an `Express.js` server with a hot module plugin from vite, emulating as if the site was built using `scripts/build.js`

What then happens client side, upon being loaded in the browser, is that the `client.tsx` file is loaded (built and processed by vite during the build process). Here if there is dom nodes in the body of the loaded index.html file, we use the React SSR api's `hydrateRoot()` to hydrate the React application, or if no dom tree exists, i.e. Client Side Rendering expected, we mount the React application like usual.

We also extract the data from the JSON string bundled by `srcipts/build.js` from the window object and apply it to our `PreloadedData` context so that it can be used by the `usePreloadedData` hook, which depending on the language in the url will return correct data.

### Conclusion

Was it worth the effort? Time will tell, relatively seen it is not that big of a technical hurdle to maintain but indeed a responsibility. A framework could have reduced the technical overhead of this project to a certain degree. Hopefully, not relying on a framework but using Vite and React directly, means the project can age long before any of these dependencies require breaking changes.

## Localization routing

A deeper review of routing of localized paths is done.

**`[todo]`**

## Component Comments

## Heavy lifters

In our application there is some more heavy components that could do with a bit of documentation. The components in question are:

- **DataTable**: A set of components, interlinked by React context to build data driven tables. Here a popular dependency like AG-Grid or TanStack's React Table could have been used. Previous reasoning applies here as well though, any dependency taken on is a marriage, but also these libraries are quite specific in their approach, React Table in particular, enforces a quite complex framework for tables. Our approach tries to keep it more simple.
- **DataForm**: A set of components, interlinked by React context to build forms for the **C**reate, **R**ead and **U**pdate in *CRUD*. Decoupling the logic needed for such state-fullness and combining the under one format. In order to render a full read, edit and update panel for the data in question. All that is needed it the declarative presenation of each field, and the responsibilities of create, edit and read is handled by the DataForm component.

These components are quite similar in that they use React context and do so in a coherent design pattern, a pattern for using context is declared in the [Frontend's GUIDELINES](GUIDELINES.md#context-components) but these components take the design pattern further.

The provider takes the data related props and houses the business logic for state-fullness and side effects while the child component are more concerned with presentation.

### Portal composition

A further study into how the pages of the portal all follow a pattern and how it works.

**`[todo]`*