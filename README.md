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

## Decisions

- Minimal customisation for users, devs handle ENUMs
- No parts
- No reservations

- Requests
 - max 5 async requests
 - 1-2 no problem, 3 possible, 4 not good (dependent requests)

## Whats done

- Admin UML in Miro
- Implement foundation
- Employee
- Customer
- Vehicle (todo: validation limit)

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
- Front end get started
- Tickets
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

- REST
  - Return obj on POST
  - Mutations through one POST using props on json obj (not split different updated to different endpints for same entity)
  - GET uses json body instead of query params
- Type and optional properties over a relationship to a type in another table with properties in it

