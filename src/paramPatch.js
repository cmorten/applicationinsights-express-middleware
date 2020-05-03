import usePatch from "./usePatch";
import { PARAM_MIDDLEWARE } from "./constants";

const paramPatch = (paramMethod, args) =>
  usePatch(paramMethod, {
    ...args,
    nextIndex: 2,
    reqIndex: 0,
    type: PARAM_MIDDLEWARE,
  });

export default paramPatch;
