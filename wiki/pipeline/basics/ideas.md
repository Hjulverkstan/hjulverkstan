---
under: the rule
kind: brief
---

# What a good pipeline is built on

A mistake in a pipeline can stop every deploy, or let a broken one through, so a pipeline is built with more care than ordinary code. Every job in it can fail, and the ideas most good pipelines share all come down to one thing: when something fails, it should fail early, cheaply, and with a clear reason. With them you can tell where a change to a pipeline belongs, and how to make it safely.

It uses the words from [reading a workflow](reading.md). How Hjulverkstan's pipeline follows each idea is in [changing our pipeline](../writing.md#1-the-ideas-in-ours).

*Common practice, not checked against an outside source.*

## 1. Fail early, where it is cheap

A mistake costs less the sooner it is found. In a pull request it costs one more push. On a practice environment it costs a fix and a wait. In front of the users it can cost them a working day. So checks run as early as possible, the cheapest first, and a run that has nothing to do stops before it starts.

Two outside tools find some mistakes even before a pull request: [actionlint](https://github.com/rhysd/actionlint) checks a workflow file without running it, and [act](https://github.com/nektos/act) runs a workflow on your own machine. Neither is covered in these pages.

*Reasoned. The two tools are named from their own pages, not tried here.*

## 2. Build once, then promote

The users should get exactly what was tried before them. So the result is built once and moved forward from one environment to the next, which is called promoting. Building again for each one risks a result that differs from the one that was tried.

Promoting is usually done by naming. Each environment runs the result that carries its name, so moving it forward is only giving it the next name.

*Reasoned.*

## 3. One file, many environments

Every environment uses the same workflow files. What differs between them, addresses, names and passwords, is stored in each environment's [variables and secrets](reading.md#5-environments-variables-and-secrets), never in the files. So a fix to the pipeline reaches every environment at once, and no environment can quietly drift from the others.

*Reasoned.*

## 4. Write each stage once

A stage used in two places is written once, as a [reusable workflow](reading.md#4-reusable-workflows-the-stage-files), and both places call it. Then the checks in a pull request and in a deploy can never become different, because they are the same file. The cost is that a change to a stage reaches every workflow that calls it, so you look at its callers before you change it.

*Reasoned.*

## 5. Say what was decided, and why it failed

Nobody watches a pipeline while it runs, so it must write down what it decided and why it stopped. A run writes a summary of its decisions, and a step that can fail prints what was wrong, in words a developer understands, before it exits. Then [watching a run](README.md#51-watching-a-run) always leads to the reason.

*Reasoned.*
