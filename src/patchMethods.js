import canPatch from "./isFunction";
import setPatched from "./setPatched";

const patchMethods = (parent, methods, patch, patchArgs = {}) => {
  methods.forEach((method) => {
    const original = parent[method];

    if (canPatch(original)) {
      parent[method] = setPatched(patch(original, patchArgs));
    }
  });
};

export default patchMethods;
