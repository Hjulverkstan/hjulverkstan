---
under: the rule
kind: brief
---

![A mountain mirrored in still water](.img/reflections.svg)

# The team's reflections

These are our team's reflections on building this wiki with an AI agent under the rule, the way of writing that every page here follows. They are what we noticed and what we think it means, not findings anyone has checked. They are written for whoever works this way next, in this team or in another project that takes up the rule.

The reflection we share most is that an agent follows the rule's instructions well but loses sight of what they are for, so keeping that purpose in view falls to the people working with it. The reflections are still being gathered, and more may be added.

*The team's reflections, September and October 2026, drawn from its own written accounts with everyone's approval. None of them is checked, and the whole is open; only the plan in §5 is in force.*

## 1. The agent keeps the instructions, people keep the purpose

The rule is there to give a reader the most understanding for the least effort. In our experience an agent holds on to the parts of it that can be checked, such as saying each fact in only one place or keeping a page's opening short. But over a long session, by which we mean one run of work with the agent from start to finish, it seemed to lose the judgment those parts serve. The text followed the instructions and still read poorly, and it took someone who knows the rule well to notice.

Our guess at why is that ease for the reader can't be measured while writing, and the specific instructions can, so the measurable slowly takes the goal's place. The rule warns of something like this itself: [a wide rule is easy to honour loosely](the-rule/rule.md#4-the-principles).

Of the judgment the rule asks for, knowing a piece's purpose was the hardest case, because there the agent had nothing to go on. An agent can order points by which depend on which. But whether they mattered, and to whom, was usually not in the material at all, so no amount of keeping to the rule could supply it. It belonged to whoever wanted the text. Without it, our sessions went in circles. We asked the agent to read the rule and do as it said, and it handed back decisions for us to make. We didn't know the answers either, so we asked it to read the rule again, and the same decisions came back. What broke the circle was a person who knew what the piece was for and said so first.

So in our work a few things fell to us rather than the agent. We chose what to build and from which sources, and judged what mattered most. We filled in what the text couldn't know about the real world, read as the real reader would, and decided what stood. How the team does that is in [how the team builds a part of the wiki](building.md).

*The team's reflection. That purpose was rarely in the material is what we saw; why the agent loses judgment over a long session is a guess.*

## 2. Working in steps we could read

Once the purpose was settled, what helped us keep it was writing less at a time. A person can steer only what they have read, so we tried to move in steps small enough to read before taking the next.

That meant asking the agent for an outline first, a few lines on what the piece should say, in what order and what goes under what, and agreeing on it. Then came a sample of a small part, adjusted until it read right, and only then the whole. A fault caught in [the outline](the-rule/rule.md#52--the-step) was never written. The outline carried the order of the points but not the purpose, though, which is why the purpose came first.

Writing faster than we read also has a cost beyond mistakes. Every claim in this wiki says how sure it is, and that can be marked honestly only by someone who has read what it marks. In the same way, agreeing to a page as a whole, which the rule's practice calls ratifying it, means little unless someone has read the page.

Two habits helped us keep hold of each step. We kept a session to one task and took side questions elsewhere, since they seemed to crowd the session and weaken the main work. And we checked the agent rather than trusting it, since it could forget, later in a session, what it was told earlier.

*The team's reflection, from what we tried; how much each habit helps is not measured.*

## 3. Starting out

The beginning felt hardest, when neither the rule nor the agent was understood yet. Steering takes knowing what a piece is for, and as newcomers we often didn't, so the agent ended up setting the direction. A newcomer who finds it hard may be helped by knowing we did too, and a guide for newcomers might help more.

*The team's reflection.*

### 3.1 Two new things at once

The rule is a new way of working, and for those of us new to software projects it was hard to tell what was new here and what is how projects usually run. We found little written about the idea outside the rule's own repository. Reading the thinkers it draws on, Vannevar Bush, Ted Nelson and Douglas Engelbart, gave us a wider view of what the work is for.

Working with the rule before grasping it was draining. It was hard to tell whether the output drifted, whether something was made up, and what mattered most, and questions like "what is the biggest win here?" or "why does this piece exist?" often had no clear answer yet.

The agent was new to us too. Words like context window, token and harness were needed early, as was the difference between AI, a language model and an agent, and without them it felt like handing the agent power without knowing what it did. Anthropic's own short articles helped us most.

Bootstrapping, what an agent reads when a session opens and before it starts the work, wasn't obvious either. The agent we used read `AGENTS.md` or `CLAUDE.md` on its own at the start, and when we asked it to read only a few files, it often read others too without always saying so.

*The team's reflection. That the rule draws on these three thinkers is carried from the rule's repository, by way of an agent's reading of it, and not checked.*

### 3.2 Keeping focus

It was easy to get stuck on what didn't matter. The rule was worked out in [its labs](the-rule/study/README.md), studies where agents wrote under the rule. Reading them, it took us a while to see that what the agents wrote about wasn't the point; how well they kept to the rule was.

Agents also left open questions in the pages they wrote, marked for the rule's author to decide. Working through every one of them pulled our attention from the task at hand.

*The team's reflection. That the rule was worked out in its labs is carried from the rule's repository and not checked.*

### 3.3 A beginner's guide

We think a short guide for newcomers would help: how to bootstrap an agent, how to prompt it well, and how to keep a session focused. It would be a different page from the one on how the team builds a part of the wiki, since it is about starting rather than building.

How complete it should be is unclear. Working through the confusion was itself much of the learning, and people with different backgrounds need different amounts of support.

*Held open, a suggestion.*

## 4. Where following the rule to the letter didn't serve the reader

Some of the rule's specific advice, followed strictly, seemed to us to work against what the rule is for. This part is for readers who know the rule's text, since each case meets it directly.

*The team's reflection; how each case meets the rule is our reading of it.*

### 4.1 Saying a fact once, and its why again

The rule says a fact has [one home](the-rule/rule.md#33--the-ground): it is said in one place and pointed to from everywhere else, so copies can't drift apart. We think that holds for a fact's details, which are what change. A short restatement of why a fact matters seems to us unlikely to mislead, if it is placed where it leads into the next point. For a reader who hasn't read the page where the fact lives, it may help more than a link back would. In this wiki, a page on the workshops' portal might say again in one line that a loan bike shows on the website only while it is available, and leave the steps for setting it to the page that holds them.

The rule comes near this when it asks a text to say [what is now held and what comes next](the-rule/rule.md#41-the-prose-of-a-brief), but it doesn't separate a fact's details from its why, and the agents we worked with kept to one home strictly.

*The team's reflection. Open: whether a restatement may go further than the why, and whether that goes against the rule.*

### 4.2 Length isn't weight

A brief, in the rule's word, is one piece of prose that gives one understanding. We found that its length didn't tell us how hard it was to read. A long brief and a shorter one could tire a reader equally, because what tired was bloat or complexity, and a word count can't tell the two apart. Writing word counts into the pages didn't help us; reading the whole carefully, round after round, found the heavy briefs better.

Breaking a brief down, taking part of it out into a brief of its own under it, also has a cost. The rule says that breaking down [as far as the knowledge yields costs the reader nothing](the-rule/rule.md#32--the-brief). In practice we found it hard to tell where the knowledge stopped yielding. When we split too far, the smaller briefs carried too little to be worth opening. Two questions might serve better than a count. Is a heavy brief bloated, to be cut, or complex, to be explained? And does a part about to be broken out give enough of its own to be worth the step?

*The team's reflection; the two questions are a suggestion, not tried.*

### 4.3 Plain prose came out choppy or tangled

The rule asks for [plain words and one idea to a sentence](the-rule/rule.md#41-the-prose-of-a-brief). The agents we worked with missed it in two directions. Sometimes they stacked short sentences without the words that join them, as if plain meant simple-minded. Other times they wrote long sentences held together by colons, semicolons and dashes.

The rule does say that simple is not terse, but that seemed to be the part that got dropped. Its own dense voice also got copied, and its terms leaked into pages for readers who never read the rule. A better aim might be the reader: write as a thoughtful colleague would explain something to another, in connected sentences, without talking down.

*The team's reflection; the aim is a suggestion, not tried.*

## 5. What this might mean for the rule

The rule rests on its labs, the studies it was worked out from. As we read them, each lab was a fresh session writing one piece, once. Our reflections come from weeks of work with an agent, where the instructions held and the judgment behind them slipped over time.

The rule claims one reading is enough to write under it, and over those weeks it wasn't for us. Whoever knew the rule best ended up reminding sessions of what they had read at the start. The rule pictures [a day where nobody has to be the way to a thing](the-rule/rule.md#2-what-it-is-for), and here someone had become the person everything about the rule went through. A reminder that has to be given again and again may point at a part of the rule that doesn't hold up over a long session.

Two remedies occur to us. What can be checked could move into a check that runs on its own, and judgment could go more often to [a fresh head](the-rule/rule.md#54--the-fresh-head), a new session that reads only the rule and the draft and says what the draft fails to give.

The rule is ratified by its author, so it changes only with the author's agreement. These reflections go to the author rather than into the rule's text.

*The team's reflection. That the labs were fresh sessions writing one piece each is our reading of them, not checked against the study. What a repeated reminder points at is a guess, and the two remedies are suggestions, not tried. None of this is proposed as a change yet; taking it to the rule's author is the plan, in force since 2026-10-13.*
