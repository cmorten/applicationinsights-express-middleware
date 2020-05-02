import express from "express";
import wrap from "./wrap";
import wrapMiddlewareUser from "./wrapMiddlewareUser";
import wrapRoute from "./wrapRoute";

wrap(express.application, ["use"], wrapMiddlewareUser);
wrap(express.Router, ["use"], wrapMiddlewareUser);
wrap(express.Router, ["route"], wrapRoute);
wrap(express.Router, ["param"], wrapMiddlewareUser, { nextIndex: 2 });

export default express;
