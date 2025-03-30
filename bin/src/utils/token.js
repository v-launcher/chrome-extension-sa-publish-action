"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateJWT = generateJWT;
const google_auth_library_1 = require("google-auth-library");
function generateJWT(keyFile, sub) {
    const client = new google_auth_library_1.JWT({
        email: keyFile.client_email,
        subject: sub,
        scopes: ["https://www.googleapis.com/auth/chromewebstore"],
        key: keyFile.private_key,
    });
    return client;
}
