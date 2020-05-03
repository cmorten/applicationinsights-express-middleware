import { AI_PATCHED_KEY } from "./constants";

const setPatched = (objectLike) => {
  objectLike[AI_PATCHED_KEY] = true;

  return objectLike;
};

export default setPatched;
