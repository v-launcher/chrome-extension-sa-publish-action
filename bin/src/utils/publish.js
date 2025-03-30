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
const superagent_1 = require("superagent");
const const_1 = require("../types/const");
function publish(accessToken, extensionId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (typeof accessToken !== "string") {
                throw Error("Invalid OAuth2 Access Token");
            }
            yield (0, superagent_1.post)(`${const_1.CHROME_WEBSTORE_BASE_URL}/v1.1/items/${extensionId}/publish`).
                set({ "Authorization": `Bearer ${accessToken}` });
        }
        catch (error) {
            throw error;
        }
    });
}
exports.default = publish;
