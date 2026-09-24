# Methods

Two methods have been used to turn a recording into a transcript. Which becomes the method is *held open*. Both start from the `.vtt` in `.raw/`, and in both the one that writes never checks its own work.

## 1. The full method

Used for [`2026-08-17-intro-pt1.md`](2026-08-17-intro-pt1.md), [`-pt2.md`](2026-08-17-intro-pt2.md) and [`2026-08-18-intro-pt3.md`](2026-08-18-intro-pt3.md). It is for when losslessness must be shown. Each step is done by a fresh head.

1. **Clean.** The `.vtt` becomes a 1:1 `clean.md`: speakers attributed, filler removed, mishearings fixed, nothing condensed.

2. **Check the clean** against the `.vtt`, until nothing is missing.

3. **Write** the transcript from the clean, whole.

4. **Check the writing.** List, passage by passage, what is missing, altered, added, or personal and over-compressed, into `.raw/…/check-<n>.md`.

5. **Rewrite** whole from the report, restoring knowledge, not wording. If the file grows by more than a tenth, wording is creeping back. Back to step 4 until clean.

## 2. The simpler way

Used for [`2026-09-16-frolunda.md`](2026-09-16-frolunda.md) ([log](../log/2026-09-24-frolunda-transcript.md)). It follows [the rule's making](../the-rule/rule.md#5-the-making) and skips the clean.

1. **Render.** A script turns the `.vtt` into plain text with a timestamp about every 30 seconds.

2. **Write** the transcript whole, ordered by the knowledge rather than the clock where that serves the reader, then reason again against the source.

3. **Fresh head.** It reports what is missing, altered, added, hard to read under the rule, or broken, and writes nothing.

4. **Rewrite** whole from the report. It was done once here, not looped until clean.
