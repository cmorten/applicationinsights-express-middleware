import patchMethods from "./patchMethods";
import usePatch from "./usePatch";
import httpMethods from "methods";

const routerMethods = ["all"].concat(httpMethods);

const routePatch = (routeMethod, args) => {
  return function patchedRoute(path, ...routeArgs) {
    const router = routeMethod.call(this, path, ...routeArgs);

    patchMethods(router, routerMethods, usePatch, { ...args, path });

    return router;
  };
};

export default routePatch;
