---
under: the rule
kind: brief
---

![A keyboard with a wrench resting on it](.img/working.svg)

# Working on it

A change to the code starts on a developer's own machine, in a short branch, and reaches the environments through the pipeline. The [setup guide](../../SETUP.md) is where a new developer begins, and it gives the commands for each step.

Neither the setup guide nor the team's guidelines are yet brought into the wiki.

*Seen, in `SETUP.md` and the guidelines, read 2026-10-20.*

## 1. Running it locally

The developer runs PostgreSQL, the API and the website side by side, with settings copied from `.env.template`. Once it runs, they log in to the portal as `admin`, with the password `password`, which the API's first data sets up.

The settings work as they are, except for the image store. The setup guide says to fill in the AWS keys `.env.template` names, but the API never reads them. It takes its keys from the machine's own AWS settings, such as a profile.

The setup guide asks for PostgreSQL 14, while the servers run 17; whether the difference matters has not been checked.

*Seen, in `SETUP.md`, `.env.template`, `data.sql` and `AwsConfig.java`. That the keys in `.env` are not read is seen in the code, not tried.*

## 2. Branches and commits

The developer works in a short branch off `main`, and proposes the change as a pull request. Each commit has one purpose and is written as `type(scope): Description`, as the [guidelines](../../GUIDELINES.md#git-strategy-) give in full.

The pipeline then checks the change, but its check is narrow, as [checking every change](pipeline/checking.md) shows. So a developer tries a change by hand before proposing it.

*Seen, in the guidelines and the pipeline's own pages.*
