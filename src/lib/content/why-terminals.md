---
title: Why I still live in the terminal
date: 2026-06-02
tags: [dev, opinion]
excerpt: A case for the command line as the calmest place to think.
---

Most of my day happens inside a terminal window. Not because it's faster to type `git status` than to click a button — it usually isn't — but because nothing in it is trying to get my attention.

Every GUI I've used eventually accretes notification badges, animated panels, and a sidebar that wants to be relevant. The terminal doesn't do any of that. It shows you exactly what you asked for and waits.

## The interface that stays still

The thing I actually value is that the terminal has no opinion about what I should do next. A modern editor is constantly making suggestions: a lightbulb in the gutter, a squiggle two files away, a toast telling me an extension has an update. Each one is individually reasonable. Together they mean the screen changes while I'm reading it.

A shell prompt changes when I change it. That's the whole difference. The state of the window after I finish a command is the state I left it in, so the context I built up in my head is still valid ten seconds later.

I don't think this makes me faster in any measurable way. It makes me interruptible on my own schedule, which is a different thing and, for the kind of work I do, a more useful one.

## Composition is the actual feature

The calmness is why I stay, but the reason I got comfortable in the first place is that every tool speaks the same language: lines of text on stdin and stdout. That means the tool I need usually already exists as a combination of tools I have.

```bash find-todos.sh
rg --line-number "TODO|FIXME" src \
  | fzf --delimiter=: --preview 'bat --color=always {1} --highlight-line {2}' \
  | cut -d: -f1,2
```

Three programs, none of which know the others exist, and the result is an interactive TODO browser with syntax-highlighted previews. Nobody designed that feature. It falls out of the fact that `rg` prints lines and `fzf` reads them.

The GUI equivalent of this is a plugin API, a marketplace, and a maintainer who has to agree with you that the feature is worth having. I've written those plugins. The pipe is better.

## What it costs

I don't want to pretend this is free. The terminal is genuinely worse at several things:

- **Discoverability.** There is no way to find out that `fzf` exists by looking at your screen. Every tool in my setup got there because someone mentioned it. That's a bad property for a system to have, and it's the main reason "just use the terminal" is unhelpful advice to give a beginner.
- **Anything two-dimensional.** Reviewing a large diff, stepping through a debugger, comparing three files at once — a GUI wins these outright, and I switch without feeling bad about it.
- **Recoverability.** A mistyped command in a GUI is a greyed-out button. In a shell it's a deleted directory. The safety rails are ones you install yourself.

The honest version of my position isn't "the terminal is better." It's that the terminal is a good default for the 80% of my work that's text going in and text coming out, and I've stopped fighting the other 20%.

## What I actually run

Less than people assume. The setup is deliberately small, because a config file I can't reconstruct from memory is a config file that will eventually break on a machine I need today.

```bash ~/.zshrc
# Keep history across sessions and dedupe it. This is the single
# highest-value line in the file.
setopt SHARE_HISTORY HIST_IGNORE_ALL_DUPS
HISTSIZE=50000
SAVEHIST=50000

# Ctrl-R through fzf instead of the built-in reverse search.
source <(fzf --zsh)

alias g=git
alias ll='eza -la --git'
```

Plus tmux for persistent sessions over SSH, and a prompt that shows the branch and nothing else. No status bar with the weather in it. The point of the setup is to disappear.

If you're starting from zero, I'd add exactly two things before anything else: shared shell history, and fuzzy search over it. Most of what a "power user" looks like from the outside is just not retyping commands they've already run.

## The point

I'm not arguing that the command line is objectively the correct interface, or that GUIs are for people who haven't learned better. Plenty of the best engineers I know work almost entirely in an IDE and ship more than I do.

The pitch is narrower than that: a tool that stays still until you tell it not to is worth something, and it's a property almost nothing else on my machine still has. Everything else — tmux, a decent prompt, fzf — is just making that stillness a little more convenient.
