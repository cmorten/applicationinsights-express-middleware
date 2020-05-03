# applicationinsights-express-middleware

Express Middleware tracking for Microsoft Application Insights SDK for Node.js.

## Contents

<!-- toc -->

- [About](#about)
- [Usage](#usage)
  - [Dependency Tracking Data](#dependency-tracking-data)
- [Developing](#developing)
  - [Install](#install)
  - [Build](#build)
  - [Test](#test)
  - [Lint](#lint)
- [Contributing](#contributing)
- [Changelog](#changelog)

<!-- tocstop -->

## About

This repository provides Express Middleware tracking for the Application Insights SDK for Node.js by monkey patching Express and the Application Insights SDK.

**Note:** This package is currently a WIP and likely to have bugs - please raise issues for anything you find. Please don't use in Production!

## Usage

Install this package using npm / yarn.

```console
yarn add applicationinsights-express-middleware
```

In your application code, require this package before Express and Application Insights:

```js
require("applicationinsights-express-middleware");

const appInsights = require("applicationinsights");
const express = require("express");

...

```

Or alternatively, use it instead of Application Insights:

```js
const appInsights = require("applicationinsights-express-middleware");
const express = require("express");

...

```

You can enable the auto-collection of Express middleware data by calling `setAutoCollectExpressMiddleware(true)` while configuring Application Insights:

```js
appInsights
  .setup("<INSTRUMENTATION_KEY>")
  .setAutoCollectExpressMiddleware(true) // Use with or without the other chained auto-collection configuration methods.
  .start();
```

The default for the Express middleware auto-collection is `false`, so not calling this method (and calling it with `false`) will result in the Express middleware not being instrumented.

If you set the value to `true`, then the once the Application Insights `start()` method is invoked, the package will then automatically invoke `trackDependency()` whenever Express middleware is executed.

Please note that the package currently does not support the `dispose()` method and therefore will not stop instrumenting Express until application restart.

### Dependency Tracking Data

The Express middleware data that is sent to Application Insights is of the following form:

```json
{
  "dependencyTypeName": "Express Middleware",
  "target": "/",
  "name": "GET / myMiddleware",
  "data": "",
  "duration": 10,
  "resultCode": 0,
  "success": true,
  "time": "2020-05-02T00:00:16.285Z"
}
```

| Key                  | Values                                                                                                                                                                                                       |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `dependencyTypeName` | One of: `"Express Middleware"`, or `"Express Param Middleware"`, or `"Express Error Middleware"`.                                                                                                                  |
| `target`             | The Express path associated with the middleware being executed.                                                                                                                                              |
| `name`               | The request method and Express path followed by the middleware function's name, or `"<anonymous>"` if the middleware function does not have a name. E.g. `"GET / myMiddleware"`, or `"POST /users/:userId <anonymous>"`. |
| `data`               | The error passed to the middleware function's `next()` method, or an empty string if no error was passed.                                                                                                                                                 |
| `duration`           | The duration of time taken to execute the middleware function in milliseconds.                                                                                                                               |
| `resultCode`         | `1` if the middleware function called the `next()` method with an error, otherwise `0`.                                                                                                                     |
| `success`            | `false` if the middleware function called the `next()` method with an error, otherwise `true`.                                                                                                              |
| `time`               | The datetime when the middleware function was invoked.                                                                                                                                                           |

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
