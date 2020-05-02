import isFunction from "./isFunction";
import isWrapped from "./isWrapped";
import setWrappedProperty from "./setWrappedProperty";
import wrapMiddleware from "./wrapMiddleware";

const getName = (objectLike) =>
  objectLike && objectLike.name ? objectLike.name : "<anonymous>";

const recursiveMiddlewareWrapperMapper = (middlewares, args) =>
  middlewares.map((middleware) => {
    if (Array.isArray(middleware)) {
      return recursiveMiddlewareWrapperMapper(middleware, args);
    } else if (!isFunction(middleware) || isWrapped(middleware)) {
      return middleware;
    }

    return setWrappedProperty(
      wrapMiddleware(middleware, { name: getName(middleware), ...args })
    );
  });

export default recursiveMiddlewareWrapperMapper;
