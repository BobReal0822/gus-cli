[![npm version](https://badge.fury.io/js/gus-cli.svg)](https://www.npmjs.com/package/gus-cli)
[![Build Status](https://travis-ci.org/ephoton/gus-cli.svg?branch=master)](https://travis-ci.org/ephoton/gus-cli)
[![Coverage Status](https://coveralls.io/repos/github/ephoton/gus-cli/badge.svg?branch=master)](https://coveralls.io/github/ephoton/gus-cli?branch=master)

# gus-cli
⚒ Command line interface for gus projects.

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

* **build [options] \<app\>**

  Build a gus app. 

  *-w, --watch*  Build and watch.

* **dev \<app\>**

  Build and watch a gus app in development environment. Mock server and [Webpack HMR](https://webpack.github.io/docs/hot-module-replacement.html) are actived.

* **start \<app\>**

  Start and daemonize a gus app.

* **stop \<app\>**

  Stop a gus app.

## Gus Project
A simple project contains multi gus apps. For example:

```text
project
├───desktop             # An app named 'desktop'.
├───dist                # Build path.
├───mobile              # An app named 'mobile'.
└───package.json
```

Use command 'gus init project' to initialize a project.

## Gus App
A serveless app use React and TypeScript for front-end engineers.

The directory structure could be like this:
```text
project
├───mock                # Mock data
│   ├───order.ts
│   └───user.ts
├───page                # Pages
│   ├───dashboard
│   ├───layout
│   └───index.tsx       # Entry file for pages.
├───style               # Styles
├───config.json         # Config file
├───index.tsx           # Entry file for front-end.
└───init.tsx            # Entry file for back-end.
```

### config options
A gus must have a config file named 'config.json'.

``` TypeScript
interface AppConfigInfo {
  server: {
    port: number;            // server port, default is 4000.
    static: string[];        // static resources, default is ['dist','node_modules']
    favicon: string;         // favicon path, default is './favicon.ico'.
  };
  style: {
    path: string;            // style source directory, default is './style'.
    items: {
      [key: string]: string;
    }
  };
  mock: {
    path: string;            // path of mock server, default is './mock'.
    active: boolean;         // enable or not, default is true.
  };
}
```

### mock server
Each file under the directory should have a default module types: 

```TypeScript
interface MockData {
  path: string;
  method: 'get' | 'post' | 'delete' | 'head' | 'put';
  data: {};
}
```

For example:
```TypeScript
export default [{
  path: '/user/1',
  method: 'get',
  data: {
    success: true,
    code: 123,
    message: '',
    data: {
      id: 1,
      name: 'bob'
    }
  }
}];
```

## Features
- Hot module replacement support.
- Mock server in development mode.
- Serverless project and app for font-end engineers.
- Fully TypeScript support.

## License
MIT License.
