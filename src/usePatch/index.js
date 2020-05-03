import joinPaths from "./joinPaths";
import isFunction from "../isFunction";
import patchMiddlewares from "./patchMiddlewares";

const usePatch = (useMethod, { path: basePath = "/", ...args }) => {
  return function patchedUse(...useArgs) {
    const pathSegment = !isFunction(useArgs[0]) ? useArgs[0] : "";

    const patchedArgs = patchMiddlewares(useArgs, {
      ...args,
      path: joinPaths(basePath, pathSegment),
    });

    return useMethod.apply(this, patchedArgs);
  };
};

export default usePatch;
