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
const node_fs_1 = __importDefault(require("node:fs"));
const token_1 = require("./utils/token");
const upload_1 = __importDefault(require("./utils/upload"));
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const serviceAccount = JSON.parse((0, core_1.getInput)("service-account-json", { required: true }));
            const folderPath = (0, core_1.getInput)("path", { required: true });
            const extensionId = (0, core_1.getInput)("chrome-extension-id", { required: true });
            const delegatedEmil = (0, core_1.getInput)("impersonated-user-email", { required: true });
            const zipFile = getBlob(folderPath);
            const accessTokenRes = yield (0, token_1.generateJWT)(serviceAccount, delegatedEmil).getAccessToken();
            yield (0, upload_1.default)(zipFile, accessTokenRes.token, extensionId);
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
