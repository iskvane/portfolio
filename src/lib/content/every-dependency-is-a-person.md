---
title: Every dependency is a person you have never met
date: 2026-08-03
tags: [security, tooling, opinion]
excerpt: Three supply chain incidents in one week, and none of them broke anything — a name changed hands and nothing downstream noticed.
---

I wrote a few weeks ago that I read every diff an agent produces, and that if a change is too large for me to actually read, that's a signal the change is wrong. I meant it, and I still do it.

I have never read a single line of the code `pnpm install` puts on my machine. Neither have you. That is roughly two thousand files arriving on my laptop with the same ceremony as a keystroke, and my entire review process for them is that the version number matched what was in the lockfile.

Three things happened in the last week that make that gap harder to keep not thinking about.

## Eight days

On 28 July, malicious beta releases of two npm packages, `@joyfill/components` and `@joyfill/layouts`, [shipped an obfuscated remote access trojan](https://www.stepsecurity.io/blog/joyfill-npm-supply-chain-compromise). The interesting part isn't the malware, which is ordinary enough. It's two structural details. First, the payload wasn't in a `postinstall` hook — it was compiled into the entry bundle and ran on import, so `npm install --ignore-scripts`, which is the mitigation most of us reach for, did nothing. Second, the malicious code existed only in the published tarballs. There was no matching commit in the project's source repository. If you had gone to GitHub and read the code, you would have found nothing, because the thing you install and the thing you can read are two different artifacts that we habitually treat as one.

On 30 July, Anthropic [published a report on incidents from its internal cybersecurity evaluations](https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals). In one of them, sandbox isolation failed, a model found a reference to a Python package that didn't exist, created it with credential-stealing code inside, and published it to the real PyPI. It was live for about an hour. In that hour it was downloaded and executed on fifteen real systems — one of which was a security company's malware scanner, which installed it in order to analyse it and got its credentials taken in the process.

Around the same time, the Arch Linux team [disabled package adoptions in the AUR](https://www.phoronix.com/news/Arch-Linux-AUR-Adoptions-Halted) because of an influx of malicious adoptions and follow-up commits. Adoption is the mechanism by which an orphaned package gets a new maintainer. There's no intrusion involved: you file a request for a package nobody maintains, you inherit its name and its history, and then you edit the build script.

## They are the same incident

I keep seeing these written up separately, as an npm story and an AI story and a Linux story. They're one story told three times.

In each case, nothing was broken. No cryptography failed, no signature was forged, no server was breached in the way that word usually implies. What happened is that control of a *name* moved to someone new — an abandoned package adopted by a stranger, a publish credential in the wrong hands, an unregistered name claimed by whoever asked first — and every system downstream continued to trust the name.

That's the actual security model we run. Not "this code is safe," which nobody has ever verified, but "this name was fine last time." And that's a claim about a person who may no longer be holding the key.

The Anthropic case sharpens it, because the number that matters there is the hour. A package that is sixty minutes old has no download history, no scan verdict, no reputation, no issue tracker, no one who has ever looked at it. Fifteen systems installed and ran it anyway, because none of them were asking about reputation. They were asking whether the name resolved.

## The number I'm leaving out

A figure circulating about the AUR waves puts the total at "over 1,900 packages compromised." I couldn't trace it to anything Arch itself published, only to news write-ups citing each other, so I'm not using it.

The number I can trace is from June, when the team finished cleaning up an earlier wave and [pointed at their own list of 1,579 affected packages](https://www.phoronix.com/news/Arch-Linux-AUR-More-Than-1500) — with the note that it was "a list containing many (but not all) of the affected packages." That's the shape of the thing: four figures, self-reported, and the maintainers themselves not certain of the boundary.

## What I changed

Modest things, because I don't think there's a heroic version of this available.

The most useful one costs a line of config. Malware in a registry tends to get caught in hours, not months — the exposure window is the gap between publication and detection. So don't install into that window. pnpm calls this `minimumReleaseAge`, and [as of v11 it defaults to 1440 minutes](https://pnpm.io/supply-chain-security), one day. I've set mine to a week for anything that isn't a security patch:

```yaml pnpm-workspace.yaml
# Don't install a version until the ecosystem has had a week
# to notice it's malicious. Bypass deliberately, per-package.
minimumReleaseAge: 10080

# Refuse a version whose trust evidence is worse than the
# last one's. A package that used to publish with provenance
# and suddenly doesn't is the exact signal I want to trip on.
trustPolicy: no-downgrade
```

`trustPolicy: no-downgrade` is the one I'd argue for hardest, because it's the only setting in my toolchain that watches for the thing that actually went wrong in all three incidents: not a bad version, but a change in who is behind the name.

I also stopped treating `--ignore-scripts` as meaningful protection. It stops install hooks. The Joyfill payload ran on import, which means a unit test, a bundler run, or a dev server was enough. Blocking install scripts and calling it handled is worse than not blocking them, because it buys a feeling of having done something.

And I now treat "this package changed maintainers" as an event, in the same category as a major version bump. I don't have a good tool for noticing it. That's a gap I'd like someone to fill.

## Where I might be wrong

The strongest objection is that a cooldown isn't a defence, it's a queue position. It works because somebody else installs the bad version first, gets hurt, and reports it. I'm not making the ecosystem safer; I'm arranging to be further back in the line. If everyone adopted a one-week cooldown, the detection that makes the cooldown work would slow down by roughly a week. That's freeriding dressed up as hygiene, and I don't have an answer to it beyond noting that I'd rather be honest about what it is.

The second objection is that all three of these were caught fast, which is an argument that the system works. The AUR wave was found and reverted, the npm versions were pulled, and the PyPI package was removed automatically by PyPI's own security systems before anyone reported it. If your position is that a distributed ecosystem with imperfect detection and quick cleanup is roughly what security looks like at this scale, none of this week is evidence against you.

The third is the one I find hardest. The real fix is fewer dependencies, and I am not going to write my own date library, or my own markdown parser, or my own React. Nobody is. Every mitigation I listed is a way of managing an exposure I've already decided to accept, and it's worth being clear that config settings are not a substitute for a smaller surface — they're what you do because you've given up on a smaller surface.

## The point

The asymmetry is what bothers me. I have built a genuinely careful review practice around code an agent writes for me — I read it, I don't let it near auth or migrations, I don't ship what I can't explain. In the same week, on the same machine, I ran a command that fetched and executed a few thousand files written by people I cannot name, some of whom acquired the right to write them last Tuesday.

The care I apply is not proportional to the risk. It's proportional to how visible the code is. Agent output shows up in a diff, so I review it. Dependency code shows up as a progress bar, so I don't.

I don't think the answer is to read node_modules. The answer is probably to stop pretending the install step is a different kind of event than the commit step, and to put even a fraction of the ceremony we've built around one of them onto the other. A week of latency and a policy that notices when a name changes hands is a small start. It's a lot more than I had a month ago.

---

## Sources

- StepSecurity — [*Compromised npm Packages: @joyfill/components and @joyfill/layouts Ship an Obfuscated Remote Access Trojan*](https://www.stepsecurity.io/blog/joyfill-npm-supply-chain-compromise), 28 July 2026. The source for the import-time trigger, the `--ignore-scripts` bypass, and the fact that the payload existed only in the published tarballs and not in the source repo.
- Anthropic — [*Investigating three real-world incidents in our cybersecurity evaluations*](https://www.anthropic.com/news/investigating-incidents-cybersecurity-evals), 30 July 2026. The primary account of the PyPI incident, including the roughly one-hour exposure window and the fifteen affected systems.
- Phoronix — [*Arch Linux AUR Under Another Wave Of Malicious Packages, Package Adoptions Halted*](https://www.phoronix.com/news/Arch-Linux-AUR-Adoptions-Halted), 31 July 2026, which links the `aur-general` announcement disabling adoptions.
- Phoronix — [*Arch Linux Now Believes Malware Incident Under Control: More Than 1,500 Affected Packages*](https://www.phoronix.com/news/Arch-Linux-AUR-More-Than-1500), 12 June 2026, for the 1,579 figure and the maintainers' own caveat about it.
- pnpm — [*Mitigating supply chain attacks*](https://pnpm.io/supply-chain-security), the documentation for `minimumReleaseAge` and `trustPolicy`, including the v11 default of 1440 minutes.

The "over 1,900 packages" figure that appears in several write-ups of the AUR waves is deliberately absent above; I could only trace it to secondary coverage.
