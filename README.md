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

> This project is now open sourced as of `2025-01-22` and licenced under the terms of the MIT licence.

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
  * [ ] [Front End](/web/README.md)
    * [ ] [Prerequisites](#prerequisites)
    * [ ] [Background & Motivation](#background--motivation)
    * [ ] [Three Layer Cake](#three-layer-cake)
    * [ ] [Directory Structure (by Features)](#directory-structure-by-features)
    * [ ] [SSG Strategy](#ssg-strategy)
    * [ ] [Localization routing](#localization-routing)
    * [ ] [Component Comments](#component-comments)
  * [ ] [Back End](/main/README.md) [TODO]
      * [ ] [Motivation]()
      * [ ] [Specific Guidelines]()
  * [ ] [AWS CDK]() [TODO]
* [ ] Run the project locally with our [Setup guide](/SETUP.md)

## Extended Intro

### Background

**[todo]: Write more about the background of Hjulverkstan**

A few links about Hjulverkstan for now (all in swedish):

- [raddabarnen.se (swedish)](https://www.raddabarnen.se/vad-vi-gor/barn-i-sverige/bekampar-utanforskap/plv/hjulverkstan-plv/)
- [poseidon.goteborg.se (swedish)](https://poseidon.goteborg.se/nyheter/nu-oppnar-hjulverkstan-i-backa/)
- [vartgoteborg.se (swedish)](https://vartgoteborg.se/p/hjulverkstan-oppnar-i-backa/)

### Progression Recap

This application's development started in the beginning of 2024 and is not yet released to production. This project has grown with the help from student internships and consultants from Alten's Gothenburg office, most of which have been between assignments. Here is an overview of the involvement and progression:

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

- Intern: [Christopher-Java](https://github.com/orgs/Hjulverkstan/people/Christopher-Java)
- Intern: [SamuelSiesjo](https://github.com/orgs/Hjulverkstan/people/SamuelSiesjo)
- Scrum and Backlog: [Azfar Imtiaz](https://github.com/orgs/Hjulverkstan/people/azfar-imtiaz)
- Technical Lead and React Focus:[Jona Cwejman](https://github.com/orgs/Hjulverkstan/people/Cwejman)
- Java Support: [Blionx](https://github.com/orgs/Hjulverkstan/people/Blionx)
- Java and DevOps Support: Kalagarsamy

**Second internship period**. The project had taken a pause during the summer and was back on track in September for a 10-week internship period, during which certain holes in the feature set of the portal were found, analyzed and refined, resulting in a more usable and production ready version of the portal.

Work on the deployment to AWS was taken further ahead, now with possible CI/CD work as the project was moved to GitHub with plans of going Open Source. The infrastructure was not completed though and still remains a task to complete.

Developers with contributions in this period:

- Intern: [Christopher-Java](https://github.com/orgs/Hjulverkstan/people/Christopher-Java)
- Intern: [Daniel Svendsén](https://github.com/orgs/Hjulverkstan/people/daniel-svendsen)
- Intern: [Daviduber69](https://github.com/orgs/Hjulverkstan/people/Daviduber69)
- Intern: [Jimssi](https://github.com/orgs/Hjulverkstan/people/jimmsi)
- Intern: [Adam](https://github.com/orgs/Hjulverkstan/people/Madasa-cell)
- Technical Lead: [Jona Cwejman](https://github.com/orgs/Hjulverkstan/people/Cwejman)
- DevOps Support: [Jeus](https://github.com/orgs/Hjulverkstan/people/jeus)
- Misc Support: [Frida Betåven](https://github.com/orgs/Hjulverkstan/people/stortoppen)

### Roadmap

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

### Call for Help

We’re excited to invite contributors to join Hjulverkstan’s open-source journey. While most progress has been made around the internship period, going open source, we hope to engage and build more consistent momentum. As we continue to develop and refine our platform, there’s plenty of meaningful work to be done. Whether you’re a developer, designer, or content creator, your skills can make a tangible difference.

This project thrives on collaboration, and your contributions will help us deliver a platform that empower local communities. From building out features and refining designs to enhancing our infrastructure, there are opportunities for everyone to get involved.

You are welcome to contribute PRs directly, say hello in GitHub Discussions or get in touch with Jona directly for inquiries at `jona.cwejman@alten.se`.

