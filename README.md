# applicationinsights-express-middleware

Express Middleware tracking for Microsoft Application Insights SDK for Node.js.

## Contents

<!-- toc -->

- [About](#about)
- [Usage](#usage)
- [Developing](#developing)
  - [Install](#install)
  - [Build](#build)
  - [Test](#test)
  - [Lint](#lint)
- [Contributing](#contributing)
- [Changelog](#changelog)

<!-- tocstop -->

## About

This repository provides Express Middleware tracking for the Application Insights SDK for Node.js by creating a shim of Express.

**Note:** This package is currently a WIP and doesn't actually log to App Insights. At the moment it will log events to the console.

## Usage

Install this package using npm / yarn.

```console
yarn add applicationinsights-express-middleware
```

In your application code, require this package before Express:

```js
const appInsights = require("applicationinsights");
require("applicationinsights-express-middleware");
const express = require("express");

const app = express();

...

```

Or use it instead of Express:

```js
const appInsights = require("applicationinsights");
const express = require("applicationinsights-express-middleware");

const app = express();

...

```

It will then automatically publish `trackDependency()` events of the form:

```json
{
  "dependencyTypeName": "Express Middleware",
  "target": "<middleware_path_or_/>",
  "name": "<middleware_name_or_anonymous>",
  "data": "",
  "duration": 10,
  "resultCode": 0,
  "success": true,
  "time": "2020-05-02T00:00:16.285Z"
}
```

## Developing

### Install

```console
yarn install --frozen-lockfile
```

### Build

```console
yarn build
```

### Test

```console
yarn test
```

### Lint

```console
yarn lint
```

## Contributing

Please check out the [CONTRIBUTING](./docs/CONTRIBUTING.md) docs.

## Changelog

Please check out the [CHANGELOG](./docs/CHANGELOG.md) docs.
