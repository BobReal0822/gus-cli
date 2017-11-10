[![npm version](https://badge.fury.io/js/gus-cli.svg)](https://www.npmjs.com/package/gus-cli)
[![Build Status](https://travis-ci.org/ephoton/gus-cli.svg?branch=master)](https://travis-ci.org/ephoton/gus-cli)
[![Coverage Status](https://coveralls.io/repos/github/ephoton/gus-cli/badge.svg?branch=master)](https://coveralls.io/github/ephoton/gus-cli?branch=master)

# gus-cli
CLI for gus projects.

## Prerequisites
- Node.js 7+
- TypeScript 2+

## Installation
```bash
npm install -g gus-cli
```

## Usage
* **init [type] [name]**

  Initialize a project, app, or component.

* **build [app]**

  Build a gus app. If 'app' equals 'undefined' or 'all', all the apps will be, all the apps will be built.

* **dev \<app\>**

  Build and watch a gus app in development mode.

* **start [app]**

  Start and daemonize a gus app. If 'app' equals 'undefined' or 'all', all the apps will be started.

* **stop <app>**

  Stop a gus app. If 'app' equals 'undefined' or 'all', all the apps will be stoped.

## Features
- Hot module replacement in development mode.
- Mock server in development mode.
- Serverless project and app for font-end engineers.
- Fully TypeScript support.

## License
MIT License.
