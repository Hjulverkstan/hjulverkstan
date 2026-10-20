---
under: the rule
kind: brief
---

# How it's built

Hjulverkstan's software is a website and the program behind it, the API, both running on Amazon's cloud. Both are built from a few well-known tools, used the same way throughout.

The website is what people open in a browser. It is both the public site, where visitors read about the workshops, and the portal, where staff log in to keep track of bikes, customers and tickets. A ticket is one thing done with a bike, such as a repair, a rental or a donation. Part of the portal, web edit, is where staff write the public site's text, in several languages, and choose its images.

The API keeps all of this. It runs on a server, with the database it writes to beside it, and puts the images in a file store; the website asks it for what it shows. Only the API reaches the database. The website's own files are kept in another store. In the repository, the website is in `web/`, the API in `api/`, and what they run on in `cdk/`.

The whole runs in three copies, called environments: dev, where the team sees a change first, test, where a release is tried, and prod, the one the workshops and visitors use. Each environment has one web address, `hjulverkstan.se` for prod, and the address sends each request on to the part that answers it.

![A flow from left to right. A browser, used by a visitor or by staff, goes to one address, hjulverkstan.se. From there three lines part: everything else goes to the website's files, in a store; paths starting /api/ go to the API, on the server, which goes on to the database, also on the server, and down to the image store; paths starting /images/ go to the image store](.img/parts.svg)\
One environment, seen from a browser. The API puts images in their store, and the address hands them out.

*Seen, in `web/`, `api/` and `cdk/`, read 2026-10-20.*

## 1. Few, plain choices

The software is built by interns and consultants who come and go, so it is meant to be readable by the next person who arrives. That decides most choices: the tools are well known, there are few of them, and the code follows the same few patterns everywhere.

The stack followed the people. The team chose React and Java early in 2024, because they matched what the consultants knew and what the interns were taught. Beyond that, a library is added only when it clearly earns its place, since every library is a commitment that has to be kept up with for as long as the project lives.

The team's [guidelines](../../GUIDELINES.md#principles-) state the principles in full: simple and coherent before clever, describing what is wanted before instructing how, small pure functions composed into larger ones, and one source of truth for every piece of data.

*Seen, in the project's readme and the guidelines; the reasons are the team's own, as written there, not checked further.*

## 2. What runs

What runs in each environment is the website, the API, and the Amazon services they stand on, each with a page of its own.

[The website](website.md)

[The API](api.md)

[Where it runs](running.md)

*Seen, in `web/`, `api/` and `cdk/`.*

## 3. Changing it

A change has two halves: the work a developer does, and the road the change then takes on its own.

[Working on it](working.md)

[The pipeline](pipeline/README.md)

*Seen, in `SETUP.md`, the guidelines and the pipeline's own pages.*
