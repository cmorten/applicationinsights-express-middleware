const express = require("express");
const httpMethods = require("methods");
const httpAndExpressMethods = [...httpMethods, "all"];

const AI_WRAPPED_KEY = Symbol("AI_WRAPPED_KEY");

const getName = (thing) => thing.name || "<anonymous>";
const setWrapped = (objectLike) => {
  Object.defineProperty(objectLike, AI_WRAPPED_KEY, {
    configurable: true,
    enumerable: false,
    writable: true,
    value: true,
  });

  return objectLike;
};
const isWrapped = (objectLike) => objectLike[AI_WRAPPED_KEY] === true;

function wrapMiddleware(middleware, path, defaultPath) {
  const name = getName(middleware);
  path = path || defaultPath;

  return function (...args) {
    this.name = name;

    const start = new Date();
    middleware.call(this, ...args);
    const end = new Date();
    const duration = end - start;

    // eslint-disable-next-line no-console
    console.log({
      dependencyTypeName: "Express Middleware",
      target: path,
      name,
      data: "",
      duration,
      resultCode: 0,
      success: true,
      time: start,
    });
  };
}

function wrapUse(subModuleMethod, defaultPath = "/") {
  return function wrappedUse(...pathAndMiddlewares) {
    const hasPath = typeof pathAndMiddlewares[0] !== "function";
    const [path, ...unwrappedMiddlewares] = hasPath
      ? [...pathAndMiddlewares]
      : [null, ...pathAndMiddlewares];

    function recursiveWrapMapper(middlewares) {
      return middlewares.map((middleware) => {
        if (Array.isArray(middleware)) {
          return recursiveWrapMapper(middleware);
        } else if (typeof middleware !== "function" || isWrapped(middleware)) {
          return middleware;
        }

        const wrappedMiddleware = wrapMiddleware.call(
          this,
          middleware,
          path,
          defaultPath
        );

        return setWrapped(wrappedMiddleware);
      });
    }

    const wrappedMiddlewares = recursiveWrapMapper.call(
      this,
      unwrappedMiddlewares
    );

    const wrappedArgs = hasPath
      ? [path, ...wrappedMiddlewares]
      : [...wrappedMiddlewares];

    return subModuleMethod.call(this, ...wrappedArgs);
  };
}

function wrapRoute(subModuleMethod) {
  return function wrappedRoute(path, ...args) {
    const router = subModuleMethod.call(this, path, ...args);
    wrap(router, httpAndExpressMethods, wrapUse, path);

    return router;
  };
}

function wrap(subModule, methods, wrapper, ...args) {
  methods.forEach((method) => {
    const original = subModule[method];

    if (!original) {
      return;
    }

    if (!isWrapped(original)) {
      const wrappedSubModule = wrapper(original, ...args);
      subModule[method] = wrappedSubModule;
      setWrapped(subModule[method]);
    }
  });
}

wrap(express.application, ["use"], wrapUse);
wrap(express.Router, ["use"], wrapUse);
wrap(express.Router, ["route"], wrapRoute);
wrap(express.Router, ["param"], wrapUse);

module.exports = express;
