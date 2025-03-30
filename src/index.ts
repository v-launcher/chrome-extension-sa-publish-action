import { getInput , info, setFailed ,error as errorLog } from "@actions/core"
import * as request from "superagent"
import jwt from "jsonwebtoken"
import fs from "node:fs"

async function run():Promise<void>{
    try {
        const serviceAccount = JSON.parse(getInput("service-account-json",{required: true}))
        info("Email"+serviceAccount.client_email)
        const folderPath = getInput("path",{
            required: true
        })
        const tokenParts = getInput("print-token")
        tokenParts.split(".").forEach((val,index)=>{
            info(`${index} - ${val}`)
        })
        const extensionId = getInput("chrome-extension-id",{required: true})
        const zipFile = getBlob(folderPath)
        const now = Math.floor(Date.now() / 1000);
        const payload = {
            iss: serviceAccount.client_email,
            scope: "https://www.googleapis.com/auth/chromewebstore", // API scope
            aud: "https://oauth2.googleapis.com/token", // Google token URL
            exp: now + 3600,
            iat: now,
            sub: getInput("impersonated-user-email")
        }
        const idToken = jwt.sign(payload, serviceAccount.private_key, {algorithm:"RS256"})
        info(`Generated Token ${idToken}`)
        const requestBody = new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: idToken
        }) 
        const token = await request.post("https://oauth2.googleapis.com/token").set({
            "content-type":"application/x-www-form-urlencoded"
        }).send(requestBody.toString())
        info(token.body.access_token)
        const extensionResponse = await request.put(`https://www.googleapis.com/upload/chromewebstore/v1.1/items/${extensionId}`).
        query({ uploadType: 'media' }).
        set({"Authorization":`Bearer ${token.body.access_token}`}).
        send(zipFile)
        info(JSON.stringify(extensionResponse.body))
    } catch (error: any) {
        setFailed(error.message)
    }
}

function getBlob(path: string): Buffer<ArrayBufferLike>{
    return fs.readFileSync(path)
}

if(require.main === module){
    run()
}