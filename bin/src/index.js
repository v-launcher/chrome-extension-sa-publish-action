"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const request = __importStar(require("superagent"));
const node_fs_1 = __importDefault(require("node:fs"));
const token_1 = require("./utils/token");
const TChromeWebstoreResponse_1 = require("./types/TChromeWebstoreResponse");
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const serviceAccount = JSON.parse((0, core_1.getInput)("service-account-json", { required: true }));
            const folderPath = (0, core_1.getInput)("path", { required: true });
            const extensionId = (0, core_1.getInput)("chrome-extension-id", { required: true });
            const delegatedEmil = (0, core_1.getInput)("impersonated-user-email", { required: true });
            const zipFile = getBlob(folderPath);
            const accessTokenRes = yield (0, token_1.generateJWT)(serviceAccount, delegatedEmil).getAccessToken();
            yield upload(zipFile, accessTokenRes.token, extensionId);
        }
        catch (error) {
            (0, core_1.setFailed)(error.message);
        }
    });
}
function getBlob(path) {
    return node_fs_1.default.readFileSync(path);
}
function upload(zip, accessToken, extensionId) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            if (typeof accessToken === "string") {
                throw Error("Invalid OAuth2 Access Token");
            }
            const extensionResponse = yield request.
                put(`${CHROME_WEBSTORE_BASE_URL}/items/${extensionId}`).
                query({ uploadType: 'media' }).
                set({ "Authorization": `Bearer ${accessToken}` }).
                send(zip);
            const chromeWebStoreResponse = extensionResponse.body;
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
if (require.main === module) {
    run();
}
