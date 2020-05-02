import wrap from "./wrap";
import wrapMiddlewareUser from "./wrapMiddlewareUser";
import httpMethods from "methods";

const httpAndExpressMethods = ["all"].concat(httpMethods);

const wrapRoute = (subModuleMethod) => {
  return function wrappedRoute(routeBase, ...args) {
    const router = subModuleMethod.call(this, routeBase, ...args);
    wrap(router, httpAndExpressMethods, wrapMiddlewareUser, { routeBase });

    return router;
  };
};

export default wrapRoute;
