import { MIDDLEWARE, ERROR_MIDDLEWARE, PARAM_MIDDLEWARE } from "./constants";

const wrappedMiddleware = async (
  middleware,
  { route, name, type, nextIndex },
  ...args
) => {
  let resultCode = 0;
  let success = true;
  let data = "";

  const wrappedNext = (next) => (error) => {
    const out = next(error);

    const isError = typeof error !== "undefined" && error !== "route";
    resultCode = isError ? 1 : 0;
    success = isError ? false : true;
    data = isError ? `${error.stack}` : "";

    return out;
  };

  args[nextIndex] = wrappedNext(args[nextIndex]);

  const start = new Date();
  const out = await middleware(...args);
  const end = new Date();
  const duration = end - start;

  // eslint-disable-next-line no-console
  console.log({
    dependencyTypeName: type,
    target: route,
    name,
    data,
    duration,
    resultCode,
    success,
    time: start,
  });

  return out;
};

const wrapMiddleware = (middleware, args) =>
  middleware.length === 4
    ? (arg1, arg2, arg3, arg4) => {
        const additionalArgs =
          args.nextIndex === 3
            ? { type: PARAM_MIDDLEWARE }
            : { type: ERROR_MIDDLEWARE, nextIndex: 3 };

        return wrappedMiddleware(
          middleware,
          {
            ...args,
            ...additionalArgs,
          },
          arg1,
          arg2,
          arg3,
          arg4
        );
      }
    : (arg1, arg2, arg3) =>
        wrappedMiddleware(
          middleware,
          { ...args, type: MIDDLEWARE, nextIndex: 2 },
          arg1,
          arg2,
          arg3
        );

export default wrapMiddleware;
