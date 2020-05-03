import { AI_PATCHED_KEY } from "./constants";

const isWrapped = (objectLike) => objectLike[AI_PATCHED_KEY];

export default isWrapped;
