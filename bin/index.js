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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_fs_1 = __importDefault(require("node:fs"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const serviceAccount = JSON.parse((0, core_1.getInput)("service-account-json", { required: true }));
            (0, core_1.info)("Email" + serviceAccount.client_email);
            const folderPath = (0, core_1.getInput)("path", {
                required: true
            });
            const tokenParts = (0, core_1.getInput)("print-token");
            tokenParts.split(".").forEach((val, index) => {
                (0, core_1.info)(`${index} - ${val}`);
            });
            const extensionId = (0, core_1.getInput)("chrome-extension-id", { required: true });
            const zipFile = getBlob(folderPath);
            const now = Math.floor(Date.now() / 1000);
            const payload = {
                iss: serviceAccount.client_email,
                scope: "https://www.googleapis.com/auth/chromewebstore", // API scope
                aud: "https://oauth2.googleapis.com/token", // Google token URL
                exp: now + 3600,
                iat: now,
                sub: (0, core_1.getInput)("impersonated-user-email")
            };
            const idToken = jsonwebtoken_1.default.sign(payload, serviceAccount.private_key, { algorithm: "RS256" });
            (0, core_1.info)(`Generated Token ${idToken}`);
            const requestBody = new URLSearchParams({
                grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
                assertion: idToken
            });
            const token = yield request.post("https://oauth2.googleapis.com/token").set({
                "content-type": "application/x-www-form-urlencoded"
            }).send(requestBody.toString());
            (0, core_1.info)(token.body.access_token);
            const extensionResponse = yield request.put(`https://www.googleapis.com/upload/chromewebstore/v1.1/items/${extensionId}`).
                query({ uploadType: 'media' }).
                set({ "Authorization": `Bearer ${token.body.access_token}` }).
                send(zipFile);
            (0, core_1.info)(JSON.stringify(extensionResponse.body));
        }
        catch (error) {
            (0, core_1.setFailed)(error.message);
        }
    });
}
function getBlob(path) {
    return node_fs_1.default.readFileSync(path);
}
if (require.main === module) {
    run();
}
