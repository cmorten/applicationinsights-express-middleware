import isFunction from "./isFunction";
import isPatched from "./isPatched";

const canPatch = (method) => isFunction(method) && !isPatched(method);

export default canPatch;
