import applicationinsights from "applicationinsights";
import express from "express";
import patchMethods from "./patchMethods";
import usePatch from "./usePatch";
import routePatch from "./routePatch";
import paramPatch from "./paramPatch";

let isExpressMiddleware = false;

const enable = (isEnabled) => {
  if (isEnabled) {
    patchMethods(express.application, ["use"], usePatch);
    patchMethods(express.Router, ["use"], usePatch);
    patchMethods(express.Router, ["route"], routePatch);
    patchMethods(express.Router, ["param"], paramPatch);
  } else {
    // TODO: dispose + unPatchMethods
  }
};

applicationinsights.Configuration.setAutoCollectExpressMiddleware = (value) => {
  isExpressMiddleware = value;

  return applicationinsights.Configuration;
};

const startPatch = (start) => {
  return function patchedStart(...startArgs) {
    if (applicationinsights.defaultClient) {
      enable(isExpressMiddleware);
    }

    return start.call(this, ...startArgs);
  };
};

patchMethods(applicationinsights, ["start"], startPatch);
patchMethods(applicationinsights.Configuration, ["start"], startPatch);

export default applicationinsights;
