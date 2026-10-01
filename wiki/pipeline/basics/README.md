---
under: the rule
kind: brief
---

# Pipelines in general

A pipeline is a row of automatic steps that checks every change to a program and delivers it to the people who use it. It works like an assembly line: the same stations, in the same order, every time, so no step depends on someone remembering it. Teams use one because doing this by hand goes wrong in ways that are easy to predict. Read on for why, what the two jobs every pipeline does are called, and the everyday words of git and GitHub that the other pipeline pages use without explaining.

Nothing here is special to Hjulverkstan, so if you already know pipelines and the everyday words of software work, you lose nothing by skipping it. The exception is the last section, [pipelines on GitHub](#5-pipelines-on-github), which is for anyone who will work with GitHub Actions: skip it only if you already know them.

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

CI means that every change is checked automatically, each time it is added to the code everyone shares. Small changes checked often are easier to fix than big ones checked rarely.

In Hjulverkstan's pipeline, CI is [checking every change](../check.md).

*Common usage, not checked against a source.*

### 2.2 CD, continuous delivery

CD means that every checked change is delivered automatically, at least to a place where it can be tried.

Some teams go further, with continuous deployment, and send every change all the way to the users by itself. Others, like Hjulverkstan, let a person decide when a change reaches the users. In Hjulverkstan's pipeline, CD is [delivering to dev, test and prod](../deliver.md).

*Common usage, not checked against a source.*

## 3. How a change travels

A change travels into the shared code in a few steps, and each step has a name. The pipeline acts on these steps, so the other pages use the names without stopping to explain them.

The text a program is written in is its **code**. It is kept with **git**, a tool that keeps every version of it, so nothing is lost and anyone can see what changed, when and by whom. The code together with its history is a **repository**, and it is kept on **GitHub**, a site where a team keeps its repositories and works on them together.

The shared version everyone works from is called **`main`**. To make a change you take a **branch**, your own copy of the code, where you work without disturbing anyone. Each time you save your work you make a **commit**: a saved version of the code, with a note saying what changed.

When the change is ready you open a **pull request**, a request to add your branch to `main`, where others can review it first. Once it is accepted it is **merged**, and the change joins `main`.

![A horizontal line labelled main, the shared version. A second line, your branch, leaves it, carries two commits marked as dots, and joins main again at a dark dot labelled merged: the change joins main. Under the branch: checked in the pull request](.img/branch.svg)\
A branch leaves `main`, holds your commits, and joins `main` again when its pull request is merged.

Some versions of `main` become releases. A release is marked with a **tag**, a name such as `v1.4.0` pinned to one commit. The name follows **semantic versioning**: three numbers, where the first grows for a big change and the last for a small fix, so the name says how big the change is.

*Common usage.*

## 4. From code to a running program

Code is only text, and a few more steps turn it into a program people can use. These too have names the other pages use.

To **build** is to turn the code into something that can run. What is built is often packed as a **Docker image**, a program packed with everything it needs to run, so it runs the same on any machine. A running copy of a Docker image is a **container**.

To **deploy** is to put a built program where its users can reach it. Where it is deployed is an **environment**: one whole running copy of a system, with its own data, on one or more servers. A team usually keeps practice copies for trying changes beside the one the users use, so a mistake on one cannot harm the others.

*Common usage.*

## 5. Pipelines on GitHub

**GitHub Actions** is GitHub's own service for running pipelines, and this section is for anyone who will work with it. A pipeline is written as workflow files in the folder `.github/workflows/`, and GitHub runs them on its own machines when something happens in the repository, such as a pull request or a merge. Its **Actions tab** lists every run.

*Common usage.*

### 5.1 Watching a run

Every run can be watched on GitHub, and when one fails, its log says why. Reading one successful run first is the quickest way to feel at home, and makes a failed one much easier to read. Try it:

1. Open the Actions tab. The workflows are listed on the left, each by the name its file gives itself in its first line. Choose one.

2. Open the newest run. A workflow can write a summary at the top, saying what it decided.

3. Below it is the graph of the run's jobs, drawn as boxes, each holding its steps. A box with nothing to do is shown as skipped.

4. Open one of the boxes in the graph, then one of its steps. Its log is what the machine printed.

A pull request's checks look the same. Open them from the pull request.

A failed run is red in the Actions tab, and on the pull request if it came from one. Its reason is three clicks away: open the run, then the red box in its graph, then the red step.

*Reasoned, from how GitHub shows a run. Not tried in this repository, nor checked against a failing run.*

### 5.2 Reading and building a workflow

A workflow file holds every detail of what a pipeline does, and a dozen words are enough to read one. The page teaches them one at a time, on Hjulverkstan's own files.

[Reading a workflow](reading.md)

---

Knowing the words, what remains is why a workflow is laid out the way it is. A few ideas are shared by most good pipelines, and they tell you where a change belongs and how to make it safely.

[What a good pipeline is built on](ideas.md)

*Each page gives its own grounds.*
