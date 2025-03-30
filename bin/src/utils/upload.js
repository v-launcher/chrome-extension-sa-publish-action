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
exports.default = upload;
const superagent_1 = require("superagent");
const TChromeWebstoreResponse_1 = require("../types/TChromeWebstoreResponse");
const const_1 = require("../types/const");
function upload(zip, accessToken, extensionId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            if (typeof accessToken !== "string") {
                throw Error("Invalid OAuth2 Access Token");
            }
            const extensionResponse = yield (0, superagent_1.put)(`${const_1.CHROME_WEBSTORE_BASE_URL}/items/${extensionId}`).
                query({ uploadType: 'media' }).
                set({ "Authorization": `Bearer ${accessToken}` }).
                send(zip);
            const chromeWebStoreResponse = extensionResponse.body;
            console.log(chromeWebStoreResponse);
            if (chromeWebStoreResponse.uploadState === TChromeWebstoreResponse_1.UploadState.FAILURE || chromeWebStoreResponse.uploadState === TChromeWebstoreResponse_1.UploadState.NOT_FOUND) {
                throw new Error(`Failed to upload chrome extension build\nuploadStatus: ${chromeWebStoreResponse.uploadState}\nerrorDetail: ${(_a = chromeWebStoreResponse.itemError.at(0)) === null || _a === void 0 ? void 0 : _a.error_detail}`);
            }
            return chromeWebStoreResponse;
        }
        catch (error) {
            throw error;
        }
    });
}
