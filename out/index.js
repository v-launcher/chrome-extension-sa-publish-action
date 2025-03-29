"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
try {
    // console.log("Token")
    (0, core_1.info)((0, core_1.getInput)("self-signed-jwt"));
}
catch (e) {
    (0, core_1.error)(e);
}
