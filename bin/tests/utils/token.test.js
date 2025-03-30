"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const node_fs_1 = require("node:fs");
const token_1 = require("../../src/utils/token");
const console_1 = require("console");
(0, globals_1.describe)("token module", () => {
    (0, globals_1.test)("generate jwt", () => __awaiter(void 0, void 0, void 0, function* () {
        const key = (0, node_fs_1.readFileSync)("key.json", "utf8");
        const jwt = (0, token_1.generateJWT)(JSON.parse(key), "support@codimite.com");
        const accessToken = yield jwt.getAccessToken();
        (0, console_1.log)(accessToken);
    }));
});
