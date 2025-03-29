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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@actions/core");
const axios_1 = require("axios");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const node_fs_1 = __importDefault(require("node:fs"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const serviceAccount = JSON.parse((0, core_1.getInput)("service-account-json", { required: true }));
            (0, core_1.info)("Email" + serviceAccount.client_email);
            const folderPath = (0, core_1.getInput)("path", {
                required: true
            });
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
            const requestBody = new URLSearchParams({
                grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
                assertion: idToken
            });
            // const response = await axios.post("https://oauth2.googleapis.com/token",requestBody.toString(),{
            //     headers: { "Content-Type": "application/x-www-form-urlencoded"}
            // })
            // const extensionId = getInput("chrome-extension-id")
            const fileList = node_fs_1.default.readdirSync("./");
            fileList.forEach((fileName) => {
                (0, core_1.info)(fileName);
            });
            const pathFiles = node_fs_1.default.readdirSync(folderPath);
            pathFiles.forEach((fileName) => {
                (0, core_1.info)(fileName);
            });
        }
        catch (error) {
            if ((0, axios_1.isAxiosError)(error)) {
                (0, core_1.setFailed)((_a = error.response) === null || _a === void 0 ? void 0 : _a.data);
                return;
            }
            (0, core_1.setFailed)(error.message);
        }
    });
}
if (require.main === module) {
    run();
}
