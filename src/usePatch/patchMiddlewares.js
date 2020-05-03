import canPatch from "../canPatch";
import setPatched from "../setPatched";
import middlewarePatch from "./middlewarePatch";
import { ERROR_MIDDLEWARE, MIDDLEWARE } from "../constants";

const getName = (middleware) => middleware.name || "<anonymous>";

const getType = (middleware, type) =>
  type || middleware.length === 4 ? ERROR_MIDDLEWARE : MIDDLEWARE;

const getReqIndex = (middleware, reqIndex) =>
  reqIndex || middleware.length === 4 ? 1 : 0;

const getNextIndex = (middleware, nextIndex) =>
  nextIndex || middleware.length === 4 ? 3 : 2;

const getMiddlewareMetadata = (
  middleware,
  { type, reqIndex, nextIndex, ...args }
) => ({
  ...args,
  name: getName(middleware),
  type: getType(middleware, type),
  reqIndex: getReqIndex(middleware, reqIndex),
  nextIndex: getNextIndex(middleware, nextIndex),
});

const patchMiddlewares = (middlewares, args) =>
  middlewares.map((middleware) => {
    if (Array.isArray(middleware)) {
      return patchMiddlewares(middleware, args);
    } else if (canPatch(middleware)) {
      return setPatched(
        middlewarePatch(middleware, getMiddlewareMetadata(middleware, args))
      );
    }

    return middleware;
  });

export default patchMiddlewares;
