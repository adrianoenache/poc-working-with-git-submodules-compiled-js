# Proof of concept (POC) of working with Git submodules - Compiled JS

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

This repository is responsible for compiling JavaScript source files via Webpack into a distributed JS bundle. The compiled output is published to [`poc-working-with-git-submodules-packages-for-distribution`](https://github.com/adrianoenache/poc-working-with-git-submodules-packages-for-distribution) via a git submodule linked at `distribution/`.

> Important! This repository uses git submodules.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Project structure](#project-structure)
- [Get started](#get-started)
  - [Clone](#clone)
  - [Submodule update](#submodule-update)
- [Setup & Installation](#setup--installation)
- [Development](#development)
- [Pre-commit hooks](#pre-commit-hooks)
- [Git submodules](#git-submodules)
- [Troubleshooting](#troubleshooting)
- [Main repository](#main-repository)
- [License](#license)
- [References](#references)

## Prerequisites

- Node.js >= 24.14.1
- npm >= 11.11.0
- Git (with submodule support)

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

### Submodule update

This command will retrieve the latest commits from the branch configured in the **.gitmodules** file, assuming you have already run commands `git submodule init` and `git submodule sync`.

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

| Command | What it does |
|---|---|
| `npm run start` | Start JS watcher (alias for `js-watch`) |
| `npm run js` | Compile JS (production via Webpack) |
| `npm run js-watch` | Compile JS with file watcher |
| `npm run js-lint` | Run ESLint with auto-fix on JS source files |

## Pre-commit hooks

This project uses [Husky](https://typicode.github.io/husky/) to run checks automatically before every commit:

| Hook | Command | What it does |
|---|---|---|
| pre-commit | `npm run js-lint` | Runs ESLint with auto-fix on JS source files |

Commits are blocked if any lint check fails.

## Git submodules

- [Proof of concept (POC) of working with Git submodules - Packages for distribution](https://github.com/adrianoenache/poc-working-with-git-submodules-packages-for-distribution)

## Troubleshooting

**Submodule directory is empty after cloning**

If you cloned without `--recurse-submodules`, the `distribution/` folder will be empty. Run:

```bash
git submodule init && git submodule sync && git submodule update
```

**Submodule is in `detached HEAD` state**

This is expected after `git submodule update`. The submodule is checked out at the commit pointer recorded in this repository, not at the tip of a branch. To work on the submodule and push changes, navigate into the directory and check out the appropriate branch:

```bash
cd distribution
git checkout <branch>
```

**Unexpected submodule changes in `git status`**

If `git status` shows `modified: distribution (new commits)` without you having changed anything, your local submodule pointer is ahead of what is recorded in this repository. Either commit the updated pointer (if intentional) or reset it:

```bash
git submodule update --checkout
```

## Main repository

- [Proof of concept (POC) of working with Git submodules](https://github.com/adrianoenache/poc-working-with-git-submodules)

## License

[MIT](LICENSE)

## References

- [Webpack — A static module bundler for modern JavaScript applications](https://webpack.js.org/)
- [ESLint — Find and fix problems in your JavaScript code](https://eslint.org/)
- [Git Tools Submodules - git-scm](https://git-scm.com/book/en/v2/Git-Tools-Submodules)
- [Git submodules - Atlassian](https://www.atlassian.com/br/git/tutorials/git-submodule)
- [Working with submodules](https://github.blog/open-source/git/working-with-submodules/)
