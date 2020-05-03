import applicationinsights from "applicationinsights";
import canPatch from "../canPatch";
import setPatched from "../setPatched";
import { MIDDLEWARE } from "../constants";

const patchedMiddleware = async (
  middleware,
  { path, name, type, reqIndex, nextIndex },
  ...middlewareArgs
) => {
  let resultCode = 0;
  let success = true;
  let data = "";

  const nextPatch = (next) => (nextArg) => {
    const out = next(nextArg);

    const isError = typeof nextArg !== "undefined" && nextArg !== "route";
    resultCode = isError ? 1 : 0;
    success = isError ? false : true;
    data = isError ? `${nextArg.stack}` : "";

    return out;
  };

  const originalNext = middlewareArgs[nextIndex];

  if (canPatch(originalNext)) {
    middlewareArgs[nextIndex] = setPatched(nextPatch(originalNext));
  }

  const start = new Date();
  const out = await middleware(...middlewareArgs);
  const end = new Date();

  const enhancedName = `${middlewareArgs[reqIndex].method} ${path} ${name}`;

  applicationinsights.defaultClient.trackDependency({
    dependencyTypeName: type,
    target: path,
    name: enhancedName,
    data,
    duration: end - start,
    resultCode,
    success,
    time: start,
  });

  return out;
};

const middlewarePatch = (middleware, args) => {
  if (args.type === MIDDLEWARE) {
    return (arg1, arg2, arg3) =>
      patchedMiddleware(middleware, args, arg1, arg2, arg3);
  }

  return (arg1, arg2, arg3, arg4) =>
    patchedMiddleware(middleware, args, arg1, arg2, arg3, arg4);
};

export default middlewarePatch;
