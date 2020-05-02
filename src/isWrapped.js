import { AI_WRAPPED_KEY } from "./constants";

const isWrapped = (objectLike) => objectLike[AI_WRAPPED_KEY] === true;

export default isWrapped;
