---
title: "Rust for web developers: a gentle start"
date: 2026-02-11
tags: [rust, learning]
excerpt: What clicked, what didn't, and where to begin.
---

I came to Rust from TypeScript, expecting the borrow checker to feel like an adversary. It mostly doesn't — it feels like a linter that's unusually honest about the bugs you were about to ship.

Six months in, I'm not fast in it. But I've stopped being surprised by it, which is the part that took the longest and the part nobody writes down.

## What clicked immediately

`Option` and `Result` replacing null checks and try/catch. If you've spent any time with TypeScript's strict mode, you already have the instinct: absence should be in the type, and the compiler should make you deal with it. Rust just applies the same idea to failure.

```rust src/config.rs
use std::fs;

// The ? returns early on Err, the way an exception would unwind.
// Difference: the return type says out loud that it can happen.
fn load_port(path: &str) -> Result<u16, Box<dyn std::error::Error>> {
    let raw = fs::read_to_string(path)?;
    let port: u16 = raw.trim().parse()?;
    Ok(port)
}

fn main() {
    match load_port("port.txt") {
        Ok(port) => println!("listening on {port}"),
        Err(e) => eprintln!("bad config: {e}"),
    }
}
```

Two things I liked more than I expected. The `?` operator gives you most of the ergonomics of exceptions without the invisible control flow — you can see every place a function can bail out, because they all have a question mark on them. And `match` being an expression means the "what do I do about this error" branch sits right next to the happy path instead of at the bottom of the file.

Enums with data attached were the other early win. A TypeScript discriminated union does roughly the same job, but you have to build it by hand and remember to keep the switch exhaustive. In Rust the exhaustiveness check is not optional, so adding a variant turns into a list of compiler errors pointing at every place that needs a decision. That's the single most pleasant refactoring experience I've had in any language.

## What didn't click for weeks

Lifetimes — not the syntax, but knowing *when* the compiler actually needs me to spell one out versus when it's inferring fine on its own. For a long time I was adding `<'a>` annotations defensively, the way you might add `any` to make a type error go away, and getting a different error as a reward.

What eventually fixed it was giving up on lifetimes and learning ownership properly first. The rule is small: every value has exactly one owner, passing it by value moves ownership, and when the owner goes out of scope the value is dropped.

```rust src/main.rs
fn greet(who: String) {
    println!("hi {who}");
}

fn main() {
    let name = String::from("iskander");
    greet(name);
    println!("{name}"); // error: borrow of moved value: name
}
```

Coming from a garbage-collected language this looks absurd the first time — you passed a string to a function and now you don't have it. The fix is to borrow instead of hand over: take `&str` in `greet`, call it as `greet(&name)`, and `main` keeps the string.

Once that was automatic, lifetimes stopped being a separate topic. They're not a feature you use; they're the compiler asking which of several possible owners a borrow is tied to, in the specific cases where it can't tell. Most functions never need one.

The other thing that ate a week: `String` vs `&str`, `Vec<T>` vs `&[T]`, `to_string()` vs `into()` vs `as_str()`. There's no deep concept there, just a distinction between owned and borrowed that JavaScript never made you think about. The heuristic that got me through it — take the borrowed form as an argument, return the owned form — is right often enough to stop being a decision.

## Where the web-dev intuitions break

A few places where reaching for the familiar answer wasted my time:

- **Traits aren't interfaces.** They're closer to typeclasses. You can implement your own trait for a type someone else defined, which is a superpower with no TypeScript equivalent, and the reason so much of the ecosystem composes without adapters.
- **There's no runtime in the box.** `async fn` compiles to a state machine that does nothing until something polls it. You pick an executor — `tokio` in practice — and that choice colors your dependency tree. Coming from Node, where the event loop just exists, this is the biggest structural surprise.
- **Async is where the difficulty spikes.** Sync Rust is approachable. Async Rust adds `Pin`, `Send` bounds that fail at a call site three layers away, and lifetime errors that are genuinely hard. Don't start there and conclude the language is beyond you.
- **The build is slow and you will feel it.** No amount of tooling makes a cold release build as quick as a bundler. `cargo check` in a watch loop is the closest thing to the feedback speed you're used to.

## Where I'd start over

Skip the whole-book approach. I read most of the book first and retained maybe a third of it, because none of it was attached to a problem I had.

What actually worked:

1. **Write a small CLI tool** you'd otherwise write in a scripting language — something that reads files, transforms text, and prints. It exercises ownership, `Result`, and iterators without requiring a single lifetime annotation.
2. **Read every compiler error in full.** They are the best in the industry and they usually contain the fix. When one is opaque, `rustc --explain E0502` prints an essay with examples.
3. **Run `cargo clippy` from day one.** A lot of what makes early Rust feel like a fight is writing C-shaped code that has an idiomatic one-liner. Clippy points at it.
4. **Reach for `.clone()` when you're stuck**, and leave a comment. Fighting the borrow checker to save an allocation in a program that reads a config file is not learning, it's ceremony. You can go back and remove them later, and by then you'll know which ones mattered.

That's most of the curriculum. The book is much better as a reference you return to once you've hit the thing it's describing than as something you read front to back.
