const path = require("path");
const express = require("express");
const httpMethods = require("methods");

const httpAndExpressMethods = ["all"].concat(httpMethods);

const AI_WRAPPED_KEY = Symbol("AI_WRAPPED_KEY");

const getName = (objectLike) =>
  objectLike && objectLike.name ? objectLike.name : "<anonymous>";

const setWrapped = (objectLike) => {
  Object.defineProperty(objectLike, AI_WRAPPED_KEY, {
    enumerable: false,
    value: true,
  });

  return objectLike;
};

const isWrapped = (objectLike) => objectLike[AI_WRAPPED_KEY] === true;

const isFunction = (functionLike) => typeof functionLike === "function";

function wrapMiddleware(middleware, target, name) {
  setWrapped(middleware);

  const wrappedMiddleware = function (...args) {
    const start = new Date();
    middleware(...args);
    const end = new Date();
    const duration = end - start;

    // eslint-disable-next-line no-console
    console.log({
      dependencyTypeName: "Express Middleware",
      target,
      name,
      data: "",
      duration,
      resultCode: 0,
      success: true,
      time: start,
    });
  };

  return wrappedMiddleware.bind(middleware);
}

function recursiveMiddlewareWrapperMapper(middlewares, route) {
  return middlewares.map((middleware) => {
    if (Array.isArray(middleware)) {
      return recursiveMiddlewareWrapperMapper(middleware, route);
    } else if (!isFunction(middleware) || isWrapped(middleware)) {
      return middleware;
    }

    return wrapMiddleware.call(
      middleware,
      middleware,
      route,
      getName(middleware)
    );
  });
}

function wrapMiddlewareUser(middlewareUser, routeBase = "/") {
  return function wrappedUse(...pathAndMiddlewares) {
    const hasPath = !isFunction(pathAndMiddlewares[0]);

    const normalisedPathAndMiddlewares = hasPath
      ? pathAndMiddlewares
      : [""].concat(pathAndMiddlewares);

    const routeSegment = normalisedPathAndMiddlewares.shift();

    const route = path.join(routeBase, routeSegment);

    const wrappedMiddlewares = recursiveMiddlewareWrapperMapper(
      normalisedPathAndMiddlewares,
      route
    );

    const wrappedArgs = hasPath
      ? [routeSegment].concat(wrappedMiddlewares)
      : wrappedMiddlewares;

    return middlewareUser.apply(this, wrappedArgs);
  };
}

function wrapRoute(subModuleMethod) {
  return function wrappedRoute(route, ...args) {
    const router = subModuleMethod.call(this, route, ...args);
    wrap(router, httpAndExpressMethods, wrapMiddlewareUser, route);

    return router;
  };
}

function wrap(subModule, methods, wrapper, ...args) {
  methods.forEach((method) => {
    const original = subModule[method];

    if (isFunction(original) && !isWrapped(original)) {
      subModule[method] = wrapper(original, ...args);
      setWrapped(subModule[method]);
    }
  });
}

wrap(express.application, ["use"], wrapMiddlewareUser);
wrap(express.Router, ["use"], wrapMiddlewareUser);
wrap(express.Router, ["route"], wrapRoute);
wrap(express.Router, ["param"], wrapMiddlewareUser);

module.exports = express;
