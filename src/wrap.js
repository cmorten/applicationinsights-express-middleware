import isFunction from "./isFunction";
import isWrapped from "./isWrapped";
import setWrappedProperty from "./setWrappedProperty";

const wrap = (subModule, methods, wrapper, args) => {
  methods.forEach((method) => {
    const original = subModule[method];

    if (isFunction(original) && !isWrapped(original)) {
      subModule[method] = wrapper(original, args);
      setWrappedProperty(subModule[method]);
    }
  });
};

export default wrap;
