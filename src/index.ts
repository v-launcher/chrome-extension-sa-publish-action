import { getInput , info, setFailed ,error as errorLog } from "@actions/core"
import * as request from "superagent"
import fs from "node:fs"
import { generateJWT } from "./utils/token"

async function run():Promise<void>{
    try {
        const serviceAccount = JSON.parse(getInput("service-account-json",{required: true}))
        const folderPath = getInput("path",{required: true})
        const extensionId = getInput("chrome-extension-id",{required: true})
        const delegatedEmil = getInput("impersonated-user-email",{required: true})
        const zipFile = getBlob(folderPath)
        const accessTokenRes = await generateJWT(serviceAccount,delegatedEmil).getAccessToken()
        const extensionResponse = await request.put(`https://www.googleapis.com/upload/chromewebstore/v1.1/items/${extensionId}`).
        query({ uploadType: 'media' }).
        set({"Authorization":`Bearer ${accessTokenRes.token}`}).
        send(zipFile)
        info(`${extensionResponse.statusCode}`)
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