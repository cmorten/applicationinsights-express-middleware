import { AI_WRAPPED_KEY } from "./constants";

const setWrappedProperty = (objectLike) => {
  objectLike[AI_WRAPPED_KEY] = true;

  return objectLike;
};

export default setWrappedProperty;
