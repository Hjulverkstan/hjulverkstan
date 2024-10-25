# Front End Guidelines

This is the practical interpretation of the [Project Guideline's Principles](../GUIDELINES.md#principles-) for development within the \[web\] directory, i.e., the frontend. Please read general principles first as they are the basis of all the sections in this file. 

This file contains composition principles and rules for React development, defined in general. After reading this file it is good to read details specific to our application in the [Front End Readme](./README.md).

---

As mentioned by our principles **Favour pure function**, **Decouple side effects** and **Keep code modular** (from the [Project Principle's Composition section](../GUIDELINES.md#composition-)), it is important to modularize our system by purpose, i.e., concern, and to abstract away side effects from pure data flow. In React, everything is functions, and we do so using **hooks** and **components**. 

Because of React's purpose of building UIs, we already know that we have a separation of concern within our code base, that is **Visual Representation** and **Business Logic**, where the latter refers to deriving and updating state, reactivity and treating side effects like network request...


## Dumb Components

One old school React pattern for decoupling **Visual Representation** is through dumb components.

Let's say I'm creating a page to showcase my weekly *at the office photos*, and each photo is a card with various aesthetical characteristics. Then I would do best in not cluttering my `<Page />` component with code of this concern. Enter **Dumb components**, the components of pure nature. They take a certain amount of props, do no side effects, and always show the same visual representation for the same props. Now, for our example, my `<Page />` only needs to see `<Card title={photo.title} img={photo.image} href={`photo/${photo.id}`} />` in order to render a beautiful photo card.

## Hooks

While modularization through components is useful, it is also important to keep the logic *before the return* statement of a component, as de-cluttered as possible. While modularizing into components can reduce the clutter, it does not improve the syntax. Enter composition through hooks.

Anything that is a repeated pattern that makes sense to be used by another component is a good such candidate, for instance `useKeyPress` or `usePersistentState`. However, 90% of all state is server state, i.e., requested from a backend and quite an asyncronous nature to them. Here we drastically reduce the complexity by relying on [React Query](tanstack.com/query/) to encapsulate our request side effects. For more details on our design pattern and implementation of this, see the [Three Layer Cake](./README.md#three-layer-cake) section of the front end readme.

Note though, that many times what our components need to take space for, is the aggregation and updating of various data from hooks, props and state, in an intertwined manner. This is often highly unique to each component and is not benefited from being moved, certain parts though can be though.

## Leaf vs Global Components

### Leaf Components

Here we reflect the component tree of our application, often referred to in a code bases as, `app/` or `pages/` (in our case `root/`).

Pages that have nested pages or broken out components / domain specific files, become directories with the main component as `index.tsx`.

On every nesting, inherit the parent name as prefix but without grandparent name if it exists. Like so:

```markdown
- Banana.tsx 
- Citrus/
  - CitrusSour/
    -  index.tsx
    -  SourLemon.tsx [this nested page looses the Citrus prefix]
    -  SourLime.tsx
  - CitrusOrange.tsx [a nested page]
  - CitrusCard.tsx [a component reused only by Citrus components]
  - announcers.tsx [some file reused only by Citrus components]
  - index.tsx [the Citrus page, most likely routes to the nested pages when needed]
```

### Global Components

Components that are not tied to a specific parts of the component tree should be defined separately from it. These are global components, and should be written for reusability.

When these components are too large, the may be broken into directories and should follow the same inheritance naming pattern as [Leaf Components](#leaf-components)

## Context Components

We have some context based components in our code base, for instance [<Auth />](src/components/Auth.tsx)), [<DataTable />](src/components/DataTable/index.tsx) and more. These all stem from the same design pattern of using a hook to encapsulate the usage of the context. Here is a base template that can be used when creating new context-based components:

<details>
  <summary>Context Component Template</summary>

```typescript

import {
    createContext,
    useContext,
    useState,
} from 'react';


export interface UseTemplateReturn {
    iAmHappy: boolean;
    setIAmHappy: (value: boolean) => void;
}

const TemplateContext = createContext<undefined | UseTemplateReturn>(undefined);

export const useTempalte = () => {
    const template = useContext(TemplateContext);

    if (!template)
        throw Error('useTempalte must be invoked in a decendent of <Template.Provider />');

    return template;
};

//

interface TemplateProviderProps {
    children: ReactNode;
}

export const Provider = ({ children }: TemplateProviderProps) => {
    const [iAmHappy, setIAmHappy] = useState<>(false);


    const context: UseTemplateReturn = { iAmHappy, setIAmHappy };

    return (
        <TemplateContext.Provider value={context}>{children}</TemplateContext.Provider>
    );
};

Provider.displayName = 'TemplateProvider';

//

export function BecomeHappy () {
    const { setIAmHappy } = useAuth();

    return <Button onClick={() => setIAmHappy(true)} />
}
```

</details>

## Import and Export as *

For consistency, when we define components that leverage multiple components (most often they use context to intercommunicate and leverage a modular api through components as building blocks) we export them as their name without the common prefix, but add the common prefix to the display name.

> This is a biased approach but a decided rule in order to be coherent with [Radix Primitives](https://www.radix-ui.com/primitives/docs/) which we use heavily through pre-built components from shadcn. Shadcn does not use this pattern in their components but radix, that they are based on do. So we have rewritten the imported components for coherency.

Example:

```typescript
// Fruit.tsx

export Banana = () => { ... }

Banana.displayName = 'FruitBanana'; // This gives react dev-tools the full unique name

export Pear = () => { ... }

Pear.displayName = 'FruitPear';
```

```typesscript
// Usage of Fruit.tsx

import * as Fruit from './Fruit.tsx'

...
  return (
    <Fruit.Banana />
    <Fruit.Pear />
  );

```





