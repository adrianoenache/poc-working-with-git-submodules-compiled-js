# Proof of concept (POC) of working with Git submodules - Compiled JS

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE) [![Node.js](https://img.shields.io/badge/node-%3E%3D24.14.1-brightgreen)](package.json)

This repository compiles JavaScript source files (entry point: `src/javascript/entry/main.js`) via Webpack and outputs the production bundle to `distribution/js/`. The `distribution/` directory is a git submodule linked to [`poc-working-with-git-submodules-packages-for-distribution`](https://github.com/adrianoenache/poc-working-with-git-submodules-packages-for-distribution), so every build result is automatically versioned and publishable as a standalone package.

> **Important:** This repository uses git submodules. Always clone with `--recurse-submodules` or initialise the submodule manually after cloning — see [Get started](#get-started).

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project structure](#project-structure)
- [Get started](#get-started)
  - [Clone](#clone)
  - [Submodule configuration](#submodule-configuration)
  - [Submodule update](#submodule-update)
  - [Contributing to the distribution submodule](#contributing-to-the-distribution-submodule)
- [Setup & Installation](#setup--installation)
- [Development](#development)
- [Pre-commit hooks](#pre-commit-hooks)
- [Related repositories](#related-repositories)
- [Troubleshooting](#troubleshooting)
  - [Submodule directory is empty after cloning](#submodule-directory-is-empty-after-cloning)
  - [Submodule is in detached HEAD state](#submodule-is-in-detached-head-state)
  - [Unexpected submodule changes in git status](#unexpected-submodule-changes-in-git-status)
- [License](#license)
- [References](#references)

## Prerequisites

- Node.js >= 24.14.1
- npm >= 11.11.0
- Git (with submodule support)

> **Note:** The versions listed above are the minimum tested versions. Any higher version compatible with semver (i.e. no breaking changes) should also work.

## Project structure

| Directory | Purpose |
|---|---|
| `src/javascript/` | JavaScript source files (components, modules, functions) |
| `src/javascript/entry/` | Entry point file (`main.js`) — Webpack entry for the compiled bundle |
| `distribution/` | Git submodule pointing to `poc-working-with-git-submodules-packages-for-distribution`; compiled JS is generated here |

## Get started

### Clone

```bash
git clone --recurse-submodules git@github.com:adrianoenache/poc-working-with-git-submodules-compiled-js.git
```

If you clone the repository without the `--recurse-submodules` parameter:

```bash
git clone git@github.com:adrianoenache/poc-working-with-git-submodules-compiled-js.git
```

Run the following commands to **init**, **sync** and **update** the git submodules in the repository.

```bash
git submodule init && git submodule sync && git submodule update
```

### Submodule configuration

The `.gitmodules` file at the root of this repository defines the submodule binding:

```ini
[submodule "distribution"]
    path = distribution
    url = git@github.com:adrianoenache/poc-working-with-git-submodules-packages-for-distribution.git
    branch = develop
```

| Field | Value | Description |
|---|---|---|
| `path` | `distribution` | Local directory where the submodule is checked out |
| `url` | `git@github.com:…` | Remote repository for the distribution package |
| `branch` | `develop` | Branch tracked by `git submodule update --remote` |

### Submodule update

This command will retrieve the latest commits from the branch configured in the `.gitmodules` file (`develop`), assuming you have already run `git submodule init` and `git submodule sync`.

```bash
git submodule update --remote
```

After updating, commit the new submodule pointer and push it to origin.

```bash
git add distribution
git commit -m "Update distribution to latest develop"
git push origin <branch>
```

> **Note:** The `distribution` submodule tracks the `develop` branch of `poc-working-with-git-submodules-packages-for-distribution` (configured in `.gitmodules`).

### Contributing to the distribution submodule

If you need to make changes _inside_ the `distribution/` directory and publish them to the distribution repository, follow these steps:

**1. Enter the submodule and check out the working branch:**

```bash
cd distribution
git checkout develop
```

**2. Make your changes, then commit and push within the submodule:**

```bash
git add .
git commit -m "your message"
git push origin develop
```

**3. Return to the parent repository and update the submodule pointer:**

```bash
cd ..
git add distribution
git commit -m "Update distribution submodule pointer"
git push origin <branch>
```

> **Why step 3?** The parent repository records a specific commit SHA of the submodule. After pushing changes inside `distribution/`, the pointer in this repository must be updated and committed so that other contributors get the correct version when they run `git submodule update`.

## Setup & Installation

After cloning the repository and initializing the submodules, install all dependencies and start the project:

```bash
npm run setup
```

This command runs `npm install`, sets up Husky pre-commit hooks and **starts the JS watcher** — the terminal will remain blocked while the watcher is running. To install only, without starting the watcher:

```bash
npm i && npm run prepare
```

If you need a clean reinstall (e.g. to resolve dependency conflicts):

```bash
npm run npm-reinstall
```

This command removes `node_modules`, clears the npm cache, reinstalls all dependencies, runs `npm audit fix` and lists outdated dependencies (`npm outdated`). At the end, the JS watcher will start and **the terminal will remain blocked**.

## Development

For initial setup and clean reinstall, see [Setup & Installation](#setup--installation).

| Command | What it does |
|---|---|
| `npm run start` | Start JS watcher (alias for `js-watch`) |
| `npm run js` | Compile JS (production via Webpack) |
| `npm run js-watch` | Compile JS with file watcher |
| `npm run js-lint` | Run ESLint with auto-fix on JS source files |
| `npm run npm-reinstall` | Removes `node_modules`, clears the npm cache, reinstalls all dependencies, runs `npm audit fix`, lists outdated dependencies and starts the JS watcher |

## Pre-commit hooks

This project uses [Husky](https://typicode.github.io/husky/) to run checks automatically before every commit:

| Hook | Command | What it does |
|---|---|---|
| pre-commit | `npm run js-lint` | Runs ESLint with auto-fix on JS source files |

Commits are blocked if any lint check fails.

> **Note:** The `prepare` script (which sets up Husky) is invoked automatically when running `npm run setup`. You do not need to run it separately.

> **Bypassing hooks (use with caution):** In exceptional circumstances you can skip the pre-commit hooks with `git commit --no-verify`. This should only be used as a last resort — bypassing lint checks may introduce code quality issues into the repository.

## Related repositories

- [Proof of concept (POC) of working with Git submodules - Packages for distribution](https://github.com/adrianoenache/poc-working-with-git-submodules-packages-for-distribution) — distribution repository linked as the `distribution/` submodule
- [Proof of concept (POC) of working with Git submodules](https://github.com/adrianoenache/poc-working-with-git-submodules) — main repository that ties all POC pieces together

## Troubleshooting

### Submodule directory is empty after cloning

If you cloned without `--recurse-submodules`, the `distribution/` folder will be empty. Run:

```bash
git submodule init && git submodule sync && git submodule update
```

### Submodule is in `detached HEAD` state

This is expected after `git submodule update`. The submodule is checked out at the commit pointer recorded in this repository, not at the tip of a branch. To work on the submodule and push changes, navigate into the directory and check out the appropriate branch:

```bash
cd distribution
git checkout <branch>
```

For a complete step-by-step workflow including committing and pushing changes, see [Contributing to the distribution submodule](#contributing-to-the-distribution-submodule).

### Unexpected submodule changes in `git status`

If `git status` shows `modified: distribution (new commits)` without you having changed anything, your local submodule pointer is ahead of what is recorded in this repository. Either commit the updated pointer (if intentional) or reset it:

```bash
git submodule update --checkout
```

## License

[MIT](LICENSE)

## References

- [Webpack — A static module bundler for modern JavaScript applications](https://webpack.js.org/)
- [ESLint — Find and fix problems in your JavaScript code](https://eslint.org/)
- [Git Tools Submodules - git-scm](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [Git submodules - Atlassian](https://www.atlassian.com/br/git/tutorials/git-submodule)
- [Working with submodules](https://github.blog/open-source/git/working-with-submodules/)
