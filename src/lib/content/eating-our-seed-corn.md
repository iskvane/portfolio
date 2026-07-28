---
title: We are eating our seed corn
date: 2026-07-28
tags: [hiring, opinion, ai]
excerpt: The junior work we automated away was the same work that produced seniors.
---

I have been on both sides of this now. I mentor the juniors on my team, and I sit in the room where we decide whether a junior role gets opened at all. Those two jobs have started to contradict each other, and I have stopped being able to pretend otherwise.

The meeting version of the argument is very reasonable. We have a headcount slot. A junior costs less but produces less for the first year, and a meaningful share of that first year is senior time spent unblocking them. An agent that can work across the whole repository costs a rounding error and produces something on the first afternoon. Nobody in that room is being cynical. Every individual step is defensible. The conclusion still ends up being: not this quarter.

We have made that call enough times that it is worth saying plainly what we are actually doing. We are not choosing between a junior and a tool. We are choosing between having mid-level engineers in 2031 and not having them.

## The number I keep coming back to

Stanford's Digital Economy Lab tracked ADP payroll data for 22-to-25-year-old software developers and found employment down close to 20% from its late-2022 peak — which is to say, from roughly the moment ChatGPT shipped ([Brynjolfsson, Chandar & Chen, *Canaries in the Coal Mine?*](https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/)). Over the same period employment for older developers held up. Their framing is that young workers are the canaries: the first group to feel a labor market shift, not the only one that will.

You can argue about attribution, and I will do that below. What you cannot argue about is the shape. The decline is concentrated in exactly the occupations where AI automates rather than assists, and within those occupations it is concentrated in exactly the age band that has no track record to point at. The authors have since [held the line on that finding](https://fortune.com/2026/06/27/what-is-ai-impact-entry-level-jobs-stanford-adp-canaries-brynjolfsson-richardson/) as more data has come in.

I want to flag one thing about the numbers, because it matters for how much weight to put on any of this. The figure that circulates hardest — entry-level developer postings down 67% since 2022 — I could not trace to a primary source, only to other posts citing each other. I am leaving it out. The payroll data above is the claim I am willing to build an argument on.

## The ladder was made of the work we deleted

Here is the part that I think gets missed when this gets discussed as a jobs story. It is not only a jobs story. It is a training story.

Think about what actually turned you into someone who can be trusted with a system. For me it was two years of unglamorous work: writing the tests nobody wanted to write, chasing a flaky integration through four services, fixing the bug that turned out to be a timezone, updating the same config in eleven places and slowly understanding why it was in eleven places. None of that work was valuable in itself. Most of it was, in the strict sense, low-value ticket labor.

But it was not *only* ticket labor. It was the mechanism by which a codebase got loaded into my head. You do not learn a system by reading it. You learn it by being sent into it repeatedly on small errands until the map assembles itself.

That entire category of work is what the current generation of agents does well. So we handed it over, correctly, because it is boring and an agent does it in ten minutes. And in doing that we removed the rungs from the bottom of the ladder while leaving the top of it exactly where it was. We still need people who can look at a five-hundred-file change and say "no, not like that." We have simply stopped running the process that produced them.

## I am not arguing from abstinence

I should be clear that I am not writing this from the outside. I use these tools hard. Most of my week now involves an agent doing the first pass on something, and I would not want to go back.

But I use them with rules that I did not have to think about a year ago, and the rules are the interesting part:

- I read every diff. Not skim — read. If a change is too large for me to actually read, that is a signal the change is wrong, not a signal to trust it.
- Nothing autonomous touches auth, migrations, or money. Those are the places where being wrong is expensive and being subtly wrong is invisible.
- If I cannot explain why a generated solution works, it does not ship, however green the tests are.

Every one of those rules is only enforceable because I spent years doing the boring work myself. My ability to review agent output is downstream of an apprenticeship that I am now, in my hiring capacity, quietly declining to fund for anyone else.

That is the contradiction. I get to have judgment. I am voting against the process that created it.

## Where I might be wrong

The honest counterargument is that I am giving AI too much credit for a market correction.

The industry overhired dramatically in 2021, interest rates went up, and cost discipline arrived across the whole sector. Junior roles are the first thing cut in any downturn, because they are the roles whose return is furthest away. All of that is true, all of it predates ChatGPT, and "AI replaced the juniors" is a much cleaner story than "capital got expensive," which is probably why it travels further.

I think both things are happening, and I think the mix matters less than people arguing about it assume. If it is mostly the rate cycle, then the pipeline reopens when the cycle turns and we lose a few years. If it is mostly structural, it does not reopen at all. Either way the gap gets created now, and it is not fillable later — you cannot retroactively give someone the 2026 they did not have.

We have run this experiment before at smaller scale. Hiring froze after 2008, and by around 2012 companies were competing over a shortage of engineers with three to five years of experience, because those people had never been hired in the first place. That was a two-year freeze in a much smaller industry, and it took most of a decade to work through.

## What I am actually changing

This is where I want to resist writing the tidy policy recommendation, because I do not run the company and I do not control the headcount. What I control is how I spend my own week. So the honest version of the conclusion is aimed at myself, and at anyone else senior enough that mentoring has quietly become the thing that gets dropped when the sprint gets tight.

The one existence proof worth knowing about: IBM announced it would [triple its US entry-level hiring in 2026](https://www.cio.com/article/4134276/ibm-looks-beyond-short-term-ai-gains-tripling-entry-level-hiring.html), but restructured what a junior does — less routine implementation, more time on understanding what the customer actually asked for and on validating what the AI produced. Their CHRO [made the long-horizon version of the argument out loud](https://www.pymnts.com/artificial-intelligence-2/2026/ibm-to-triple-entry-level-hiring-as-ai-rewrites-junior-roles/): cutting entry-level hiring lowers costs now and leaves you buying mid-levels from competitors later, at a markup.

That is the right instinct. The junior role does not need to be protected in its old form. It needs to be pointed at the skills that are now scarce, which are judgment and verification, not typing speed.

Concretely, the things I have changed:

**I stopped giving juniors the leftover work.** The tickets I used to hand down are the tickets the agent now does. Giving someone the residue of that pile is a worse apprenticeship than I had, not a cheaper one. They get real features with real ambiguity in them.

**I make them review agent output, out loud, with me.** This turns out to be the highest-density teaching I have ever done. A generated diff is a free supply of plausible-looking code that is subtly wrong in interesting ways, and going through one together teaches more per hour than watching someone write the same code by hand ever did.

**I treat mentoring as delivery, not as goodwill.** If it does not appear in my week as an actual scheduled block, it does not happen, and then I am surprised in six months when nobody on the team has grown. The version of this that works is boring and calendarized.

**I say the long-term cost out loud in hiring conversations.** Not to win — I usually do not win — but because "we will need mid-levels in five years and we are not making any" deserves to be a stated cost rather than an unstated one. Decisions get worse when the expensive part is the part nobody says.

## The point

The pitch is not that AI is bad, or that we should staff teams inefficiently out of sentiment. It is narrower than that: the work we automated was doing a second job that nothing has replaced, and the bill for that arrives years after the savings do.

I am not going to fix the pipeline. But the specific reason I am able to use these tools well is that somebody, ten years ago, spent their time on me while I was slow. That was expensive for them and invisible on any quarterly metric. Paying it forward is the part of this I actually control, and right now it is the only part of the system that still works.

---

## Sources

- Erik Brynjolfsson, Bharat Chandar, Ruyu Chen — [*Canaries in the Coal Mine? Six Facts about the Recent Employment Effects of Artificial Intelligence*](https://digitaleconomy.stanford.edu/publication/canaries-in-the-coal-mine-six-facts-about-the-recent-employment-effects-of-artificial-intelligence/), Stanford Digital Economy Lab. The ~20% figure for 22-to-25-year-old developers comes from their ADP payroll analysis.
- Fortune — [*The Stanford economist who called the AI entry-level jobs crisis early has the receipts*](https://fortune.com/2026/06/27/what-is-ai-impact-entry-level-jobs-stanford-adp-canaries-brynjolfsson-richardson/), on how the finding has held up.
- CIO — [*IBM looks beyond short-term AI gains, tripling entry-level hiring*](https://www.cio.com/article/4134276/ibm-looks-beyond-short-term-ai-gains-tripling-entry-level-hiring.html).
- PYMNTS — [*IBM to Triple Entry-Level Hiring as AI Rewrites Junior Roles*](https://www.pymnts.com/artificial-intelligence-2/2026/ibm-to-triple-entry-level-hiring-as-ai-rewrites-junior-roles/), including LaMoreaux's remarks on the three-to-five-year cost.
- Stanford SIEPR — [*What is really happening to jobs? Separating AI hype from reality*](https://siepr.stanford.edu/publications/policy-brief/what-really-happening-jobs-separating-ai-hype-reality), which is the best short treatment of the attribution problem I raise above.

The 2008 comparison is my own recollection of that hiring cycle rather than a cited finding, and should be read as an analogy, not evidence.
