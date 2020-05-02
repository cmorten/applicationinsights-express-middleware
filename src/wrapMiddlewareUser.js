import path from "path";
import isFunction from "./isFunction";
import recursiveMiddlewareWrapperMapper from "./recursiveMiddlewareWrapperMapper";

const wrapMiddlewareUser = (
  middlewareUser,
  { routeBase = "/", nextIndex } = {}
) =>
  function (...pathAndMiddlewares) {
    const hasPath = !isFunction(pathAndMiddlewares[0]);

    const normalisedPathAndMiddlewares = hasPath
      ? pathAndMiddlewares
      : [""].concat(pathAndMiddlewares);

    const routeSegment = normalisedPathAndMiddlewares.shift();

    const route = path.join(routeBase, routeSegment);

    const wrappedMiddlewares = recursiveMiddlewareWrapperMapper(
      normalisedPathAndMiddlewares,
      { route, nextIndex }
    );

    const wrappedArgs = hasPath
      ? [routeSegment].concat(wrappedMiddlewares)
      : wrappedMiddlewares;

    return middlewareUser.apply(this, wrappedArgs);
  };

export default wrapMiddlewareUser;
