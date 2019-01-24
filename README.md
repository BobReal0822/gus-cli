# gus
⚒ Command line tool for gus apps.

## Prerequisites
- Node.js 8+
- TypeScript 2.7+

## Installation
```bash
1. git clone git@github.com:ephoton/gus-cli.git
2. cd gus-cli && yarn && tsc && npm link
```

## Usage
* **init [type] [name]**

  Initialize an app, the type should be [website | spa].

* **add [path] [name]**

  Add a page(or component).

* **build [options]**

  Build before deploying.

  *-w, --watch*  Build and watch.

* **dev**

  Build and watch in development mode. [Webpack HMR](https://webpack.github.io/docs/hot-module-replacement.html) are active.

* **publish**

  Publish statics to CDN server or OSS, including js, css and images.

## gus app

### 1. Website app

The directory structure could be like this:
```text
Website
├───dist                # Output files
├───src
│   ├───page            # Pages
│   └───style           # Styles for pages
├───static              # Static files, include images, videos and third-party js
├───view                # Views, entry files for pages
└───config.json         # Config file
```

Config options:
``` TypeScript
interface AppConfigInfo {
  outDir: string;             // Dirctory for output files, default is './dist'
  entryDir: string;           // Entry files for pages, default is './src/page'
  server: {
    port: number;             // Port for node server, default is 3000.
    static: string;           // Path for static resources, default is './static'
    view: string;             // Path for views, default is './view'.
  };
}
```

Skill set required:
```text
React, Scss
```

### 2. [SPA(Single-page application)](https://en.wikipedia.org/wiki/Single-page_application)

The directory structure could be like this:
```text
SPA
├───dist                # Output files
├───mock                # Path of mock data
├───src
│   ├───page            # Pages
│   ├───style           # Styles for pages
│   └───index.tsx       # The single entry file
├───static              # Static files, include images, videos and third-party js
├───view                # Directory for the single page, view entry for the whole app
├───tsconfig.json
├───tslint.json
└───config.json         # Config file
```

Config options:
``` TypeScript
interface AppConfigInfo {
  outDir: string;             // Directory for output files, default is './dist'
  entry: string;              // Path for the entry file, default is './src/index.tsx'
  server: {
    port: number;             // Port for node server, default is 3000
    static: string;           // Path for static resources, default is './static'
    view: string;             // Path for views, default is './view'
  };
  mock: {
    path: string;             // Path for API mock data, default is './mock'
    active: boolean;          // Enable or disable mock data, default is true
  }
}
```

Mock data schema:
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

Skill set required:
```text
TypeScript, React, Less, Redux
```

## Features
- Hot module replacement support.
- Mock server in development mode.
- Serverless project and app for font-end engineers.
- Fully TypeScript support.
