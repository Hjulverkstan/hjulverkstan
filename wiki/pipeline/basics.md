---
under: the rule
kind: brief
---

# Pipelines in general

A pipeline is a row of automatic steps that checks every change to a program and delivers it to the people who use it. It works like an assembly line: the same stations, in the same order, every time. Teams use one because doing this by hand goes wrong in ways that are easy to predict.

Nothing on this page is special to Hjulverkstan, so if you already know pipelines and the everyday words of software work, you lose nothing by skipping it.

![A table with four questions down the side and two columns, by hand and with a pipeline. The steps: done from memory, or written once and run by a machine. The checks: if someone remembers, or on every change. What runs where: someone has to know, or named by version. Releases: rare, big and risky, or often, small and routine](.img/by-hand.svg)\
The same four questions, answered by hand and by a pipeline.

*Reasoned. The problems of delivering by hand are common experience in software, not seen in this project's own history.*

## 1. Delivering by hand

Doing it by hand is a circle, where each problem makes the next one worse.

A developer builds the new version on their own laptop, turning the code into a program that can run. They copy it to the server, the computer the program runs on for its users, and start it again. One day they forget a step, or their laptop has a setting the server does not. The program stops working on a Monday morning. Nobody is sure which version is running, or what changed. So people become afraid of releasing. They release rarely, and each release holds many changes, which makes the next one even riskier.

A pipeline breaks that circle. The steps are written down once and run by a machine, so none is forgotten. Every change is checked before it goes anywhere. Every version has a name, so anyone can see what runs where. And because releasing becomes safe and routine, it can happen often, in small steps that are easy to check.

*Reasoned, as above.*

## 2. CI and CD

A pipeline does two things, and they have names you will meet everywhere: CI checks every change, and CD delivers it.

*Common usage of the two names, not checked against a source.*

### 2.1 CI, continuous integration

CI means that every change is checked automatically, each time it is merged, joined, into the shared code, the one version everyone works from. Small changes checked often are easier to fix than big ones checked rarely.

In Hjulverkstan's pipeline, CI is [checking every change](check.md).

*Common usage, not checked against a source.*

### 2.2 CD, continuous delivery

CD means that every checked change is delivered automatically, at least to a place where it can be tried.

Some teams go further, with continuous deployment, and send every change all the way to the users by itself. Others, like Hjulverkstan, let a person decide when a change reaches the users. In Hjulverkstan's pipeline, CD is [delivering to dev, test and prod](deliver.md).

*Common usage, not checked against a source.*

## 3. The words

A few everyday words of software work appear on every page. Each is given here once, so the other pages can use them without stopping to explain.

- Code: the text a program is written in.

- Commit: a saved version of the code, with a note saying what changed.

- Branch: your own copy of the code, where you make a change without disturbing anyone.

- `main`: the shared version of the code that everyone works from.

- Pull request: a request to add the change on your branch to `main`, where others can review it first.

- Merge: adding the change to `main`, once the pull request is accepted.

![A horizontal line labelled main, the shared version. A second line, your branch, leaves it, carries two commits marked as dots, and joins main again at a dark dot labelled merged: the change joins main. Under the branch: checked in the pull request](.img/branch.svg)\
A branch leaves `main`, holds your commits, and joins `main` again when its pull request is merged.

- Tag: a name, such as `v1.4.0`, pinned to one commit.

- Semantic versioning: numbering versions as three numbers, such as `1.4.0`, so the number says how big the change is.

- Build: turning the code into something that can run.

- Deploy: putting a built program where its users can reach it.

- Docker image: a program packed with everything it needs to run, so it runs the same on any machine.

- GitHub: the site where the code is kept.

- GitHub Actions: GitHub's own service for running pipelines. A pipeline is written as workflow files in the folder `.github/workflows/`, and GitHub runs them on its own machines when something happens in the repository, such as a pull request or a merge. Its Actions tab lists every run.

*Common usage.*