![Hjulverkstan header"](https://raw.githubusercontent.com/Hjulverkstan/.github/images/hjulverkstan-banner.png)

<p>
  <a href="https://www.alten.se" alt="Alten Sweden">
     <img src="https://raw.githubusercontent.com/Hjulverkstan/.github/images/badge-alten.svg" />
  </a>
 &nbsp;
  <a href="https://raddabarnen.se" alt="Rädda Barnen">
     <img src="https://raw.githubusercontent.com/Hjulverkstan/.github/images/badge-stc.svg" />
  </a>
</p>

> This project is now open source as of `2025-01-22` and licenced under the terms of the MIT licence.

## Short intro

Hjulverkstan (translated as “The Wheel Shop”) is an initiative launched by [Save the Children Sweden](rb.se) in Gothenburg. Its mission is to support integration and empower local residents by offering free services and employments through bicycle workshops. These workshops provide a range of resources, including bike repairs, rentals, and cycling lessons. While bicycles are the medium, the heart of Hjulverkstan lies in fostering a strong sense of community and improving the lives for locals.

As the initiative grows, so does the need for effective digital tools to manage operations. With an expanding network of workshops, there is an increasing demand for a system to oversee bike inventory and streamline processes related to customers, employees, and services. Additionally, Hjulverkstan seeks a public-facing website to amplify its mission and reach a wider audience. To address these needs, [Alten Sweden](www.alten.se) has stepped forward to develop a combined web app and website, offering their expertise pro bono through internships and intermission consultants.

This project thrives because of the collective effort and commitment of its partners. While Alten Sweden leads the technical development, the initiative welcomes contributions from all individuals and organizations who share its vision of building stronger, more inclusive communities.

## Getting started

Here is an overview and guide on how to get started in the project. If you are looking to contribute, please complete the checklist before submitting a PR.

* [ ] Read the [Extended Background](#extended-intro)
* [ ] Learn the [Project Guidelines](/GUIDELINES.md)
  * [ ] [Principles](/GUIDELINES.md#principles-)
  * [ ] [Git Strategy](/GUIDELINES.md#git-strategy-)
  * [ ] [Rules](/GUIDELINES.md#rules-)
* [ ] Catch up on the domain-specific documentation:
  * [ ] [Front End Readme](/web/README.md)
    * [ ] [Prerequisites](#prerequisites)
    * [ ] [Background & Motivation](#background--motivation)
    * [ ] [Three Layer Cake](#three-layer-cake)
    * [ ] [Directory Structure (by Features)](#directory-structure-by-features)
    * [ ] [SSG Strategy](#ssg-strategy)
    * [ ] [Localization routing](#localization-routing)
    * [ ] [Component Comments](#component-comments)
  * [ ] [Front End Guidelines](/web/GUIDELINES.md) – General project agnostic guidelines about our approach to React development.
  * [ ] [Back End](/main/README.md) [TODO]
      * [ ] [Motivation]()
      * [ ] [Specific Guidelines]()
  * [ ] [AWS CDK]() [TODO]
* [ ] Run the project locally with our [Setup guide](/SETUP.md)

### Extended Intro

**[todo]: Write more about the background of Hjulverkstan**

A few links about Hjulverkstan for now (all in swedish):

- [raddabarnen.se (swedish)](https://www.raddabarnen.se/vad-vi-gor/barn-i-sverige/bekampar-utanforskap/plv/hjulverkstan-plv/)
- [poseidon.goteborg.se (swedish)](https://poseidon.goteborg.se/nyheter/nu-oppnar-hjulverkstan-i-backa/)
- [vartgoteborg.se (swedish)](https://vartgoteborg.se/p/hjulverkstan-oppnar-i-backa/)

## Development Recap

 <a href="https://github.com/Hjulverkstan/hjulverkstan/blob/main/.screenshots/" alt="Project screenshots">
     <img src="https://raw.githubusercontent.com/Hjulverkstan/.github/images/screenshots.png" />
  </a>

<p>&nbsp;</p>

This application's development started in the beginning of 2024 and is not yet released to production. This project has grown with the help from student internships and consultants from Alten's Gothenburg office, most of which have been between assignments and with time to help. Here is an overview of the involvement and progression:

**Project kickoff** – interns and various Alten employees meet Save the Children and start to refine the goals at hand.

**Project started – first internship period** – through workshops in the team and with Save the Children a scope is defined and technical solutions are explored. Quite quickly the stack of React and Java is settled for, matching the consultants experience and the interns' education program. During the internship period of February to May an MVP variant of the **Portal** application, the internal web app for day to day operations and admin, was created. Here is an overview of what it accomplished:

- **Shop**: A sub app for daily operations carried out by employees:
  - **inventory**: Manage an inventory of bikes and their details
  - **tickets**: Create tickets to bind a vehicle, customer and employee together to represent the different processes a vehicle can partake in, i.e. rental, repair etc.
  - **customers**: Manage customer information for integration with *tickets*
- **Admin**: A sub app for managing administrative settings 
  - **employees**: Manage employees for the system 
  - **users**: Manage logins (not the same as employees as computers are shared in the workshop)
  - **locations**: Used to manage locations that vehicles can be in, i.e. workshops and storage locations.
- **WebEdit**: A sub app for editing the public web-site (part of the same react application as the **Portal** app).
  - Here no front end was developed but a foundation and technical plan (UML diagram) was implemented for editable data with localized values.

Apart from these development efforts certain progress in Figma, for the design of the public website, was also made. The amount of design work was not enough to start development but the technical foundation for the public website including localization, Static Site Generation and routing was accomplished.

A start on moving the project to the cloud, namely AWS, was made. Through [AWS CDK](docs.aws.amazon.com/cdk/v2), providing infrastructure as code, certain parts of the tech stack was implemented – though much work lied ahead.

During this period the following developers contributed:

- Intern: [Christopher-Java](https://github.com/Christopher-Java)
- Intern: [SamuelSiesjo](https://github.com/orgs/SamuelSiesjo)
- Scrum and Backlog: [Azfar Imtiaz](https://github.com/orgs/azfar-imtiaz)
- Technical Lead and React Focus:[Jona Cwejman](https://github.com/Cwejman)
- Java Support: [Blionx](https://github.com/Blionx)
- Java and DevOps Support: Kalagarsamy

**Second internship period**. The project had taken a pause during the summer and was back on track in September for a 10-week internship period, during which certain holes in the feature set of the portal were found, analyzed and refined, resulting in a more usable and production ready version of the portal.

Work on the deployment to AWS was taken further ahead, now with possible CI/CD work as the project was moved to GitHub with plans of going Open Source. The infrastructure was not completed though and still remains a task to complete.

Developers with contributions in this period:

- Intern: [Christopher-Java](https://github.com/Christopher-Java)
- Intern: [Daniel Svendsén](https://github.com/daniel-svendsen)
- Intern: [Daviduber69](https://github.com/Daviduber69)
- Intern: [Jimmsi](https://github.com/jimmsi)
- Intern: [Adam](https://github.com/Madasa-cell)
- Technical Lead: [Jona Cwejman](https://github.com/Cwejman)
- DevOps Support: [Jeus](https://github.com/jeus)
- Misc Support: [Frida Betåven](https://github.com/stortoppen)

## Roadmap

 <a href="https://github.com/orgs/Hjulverkstan/projects/1/" alt="Project backlog">
     <img src="https://raw.githubusercontent.com/Hjulverkstan/.github/images/backlogs.png" />
  </a>

<p>&nbsp;</p>

2025 has much in store and the intention is to go to production. For a more detailed view of the backlog see the [Hjulverkstan GitHub Project View](https://github.com/orgs/Hjulverkstan/projects/1) in progress. A short overview of prioritized tasks to complete is:

* Complete Figma design of public website
* Work on copy-text with Save the Children for the public website
* Implement the public website in the React app
* Refine some finishing touches in the **Portal** *Shop* app.
* Implement the **Portal** *WebEdit* frontend and missing Spring Services.
* Implement publishing of updates in *WebEdit*
* Add image support for bikes in the *Shop*'s inventory and certain fields in *WebEdit*
* Review the Spring app align with best practices
* Complete deployment to AWS
* Complete pipelines for CI/CD

## Call for Help

We’re excited to invite contributors to join Hjulverkstan’s open-source journey. While most progress has been made around the internship period, going open source, we hope to engage and build more consistent momentum. As we continue to develop and refine our platform, there’s plenty of meaningful work to be done. Whether you’re a developer, designer, or content creator, your skills can make a tangible difference.

This project thrives on collaboration, and your contributions will help us deliver a platform that empower local communities. From building out features and refining designs to enhancing our infrastructure, there are opportunities for everyone to get involved.

You are welcome to contribute PRs directly, say hello in GitHub Discussions or get in touch with Jona directly for inquiries at `jona.cwejman@alten.se`.

## Interviews with LIA-interns

### Interview: What would have been helpful to know before joining the Hjulverkstan project?

<details>
 <summary>Jimmy Emanuelsson (spring 2025)</summary>

#### Response: Jimmy Emanuelsson

Hjulverkstan has been incredibly educational and fun to work at. It’s not often you get to work on a project where you truly touch every part of the tech stack. Many projects are called “fullstack,” but here I’ve been involved from end to end: from Figma design, to React component development for the public website, to a more complex portal with filters, tables, and forms, to the backend in Java and Postgres – including build scripts and deployment.

One of the first major challenges was getting up to speed with React – both the framework itself and the way it’s used specifically in Hjulverkstan. My education has had a strong backend focus, and my frontend experience beforehand was fairly limited and mostly centered around Vue. Jumping into a React codebase with a well-defined structure and clear code principles was a great learning experience, but also quite overwhelming at first.

One thing I wish I had understood better from the start is the functional programming mindset. The entire frontend structure is heavily built around functional composition – both in terms of logic and data flow. This was new to me, since our Java education had been strictly object-oriented. I would have really benefited from reading up more on functional programming in the context of frontend development before starting the project.

Another early challenge was understanding the underlying architecture. The React part is divided into layers: a view-layer, a hooks-layer, and an api-layer. This makes the code more readable and maintainable, but it also requires you to understand where things belong and how they connect. The same applies to how the application is built and deployed – the public site is statically generated, while the internal portal is a traditional client-side rendered app. I didn’t know much about these hybrid setups beforehand, but I’ve learned a lot about both SSG and CSR through this project.

The backend, on the other hand, was easier to get into. It’s built with Spring Boot and follows a structure I was already familiar with: controllers, services, repositories, and entities. There’s some room for improvement in the DTO layer, where there’s a bit of duplication, but overall the backend is straightforward and logical.

My advice for future internship students in the project
Don’t be afraid to dive into the codebase, even if you don’t understand everything at first. The codebase is large but well-structured – especially the frontend. You’ll find your way faster than you think. It’s easy to believe you need to grasp the entire stack before starting, but in reality, things start making sense as you work hands-on.

Get to know the project’s layered architecture. Understand how data flows from component to hook, through the API layer to the backend – and back again. A concrete example is how we handle status changes for tickets – something I worked on quite a bit during the fall of 2024. It’s a great entry point for understanding how everything is connected.

Take full ownership of your tasks. When you’re assigned something, make sure you understand it deeply. Look at similar code, ask questions, read up. It’s not just about making something “work,” but about understanding why it works. And when it’s time for a pull request, be ready to explain and defend your solution.

During the spring of 2025, I’ve worked on developing a well-structured and sustainable architecture for image uploads to S3 – a solution used both in the internal portal and on the public website. I’ve also been responsible for shaping the design of the public site and then implementing it in React. What’s been most rewarding is seeing how all the pieces connect – and knowing that what I’ve built is actually being used. Following a complete flow from design to database and back again has been both challenging and genuinely enjoyable.

</details>

<details>
 <summary>David Henriksson (spring 2025)</summary>

#### Response: David Henriksson

Before starting coding I wish that I had a better grasp of the projects data flow. Like take my time and look at the flow process of backend> api layer> frontend. So I would take some time to just look through it all, and maybe try out requests from start to end in that order. And log/sout and look what happens.   

Since React is entirely new for most of interns from Yrgo, of course learning the basics of that is mandatory. I think I actually did what I could to grasp it relatively basic in the amount of time I had. Something to note is that the basics of it only got me so far since Hjulverkstans frontend code is, for a beginner, very refined and complex. So after learning the basics you just have to start coding and look up all the things in the code you don't understand. Whenever you start a new task, make sure you understand all of it, so that you don't just rush it to get tasks done. The internship is an insanely valuable time to actually learn stuff. Especially React.  

TypeScript isn't something I'd waste too much time learning, I think you'll get the gist of it as you go. You'll probably encouter alot of red lines everywhere and learning why they pop up will prbably give you an idea of what's up. 

I would also look through all the backend code more thoroughly. The backend is created by interns in JAVA22, and JAVA23 (to some degree) but JAVA22 did basically all of the ground work. And all the Java used there is something we students already are familiar with from school. But all the DTOs was kind of confusing to me at first, and still are, seeing as the code is probably overly deliberate and duplicated, espcially in the Service implementations, and could be refactored and simplified by a lot.  

Learn what SSR, CSR and SSG is and look through the javascript files (dev.js, build.js). Then examine how these rendering strategies are implemented in the codebase. And also learn what the frick Hydration is.  

So basically; Get a better grasp of what's going on. I believe I just kind of started doing and learning along the way, but it took a while to understand the whole process of the app. But maybe that's what it's supposed to be like in an entirely new project with new libraries and tools.

</details>

<details>
 <summary>Daniel Svendsén (spring 2025)</summary>

#### Response: Daniel Svendsén

I think the internship was a great experience. I learned a lot about React, TypeScript and the project itself, I found implementing a website particurlarly fun.

I think the most important thing I learned was how to work with a codebase that is not my own. I learned how to read and understand code that I didn't write myself, and how to work with others to solve problems.

Really take time to learn the basics of React before going into to the codebase I believe is a good start. Learn the project from backend all the way up to frontend to see how it works. Take time to learn how the code is structured to be able to mimic the composition of new files. Explore the way through different files opening each method to see where it goes and what it does.

When starting tasks - make sure to read up on what you dont understand and take your time.

Remember that CSS is centralized in the project and that you should not use f.e red-500 but rather use the className that is already in the project. 

One more thing: ask if a function/method already exists before writing a new one or importing certain stuff.
</details>
