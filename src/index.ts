import { getInput, setFailed } from "@actions/core"
import fs from "node:fs"
import { generateJWT } from "./utils/token"
import upload from "./utils/upload"

async function run():Promise<void>{
    try {
        const serviceAccount = JSON.parse(getInput("service-account-json",{required: true}))
        const folderPath = getInput("path",{required: true})
        const extensionId = getInput("chrome-extension-id",{required: true})
        const delegatedEmil = getInput("impersonated-user-email",{required: true})
        const zipFile = getBlob(folderPath)
        const accessTokenRes = await generateJWT(serviceAccount,delegatedEmil).getAccessToken()
        await upload(zipFile,accessTokenRes.token,extensionId)
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