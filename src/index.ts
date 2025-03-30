import { getInput , info, setFailed ,error as errorLog } from "@actions/core"
import * as request from "superagent"
import fs from "node:fs"
import { generateJWT } from "./utils/token"
import TChromeWebStoreResponse, { UploadState } from "./types/TChromeWebstoreResponse"

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

async function upload(zip: Buffer<ArrayBufferLike> , accessToken: string | undefined | null , extensionId: string): Promise<TChromeWebStoreResponse> {
    try {
        if (typeof accessToken === "string") {
            throw Error("Invalid OAuth2 Access Token")
        }
        const extensionResponse = await request.
        put(`${CHROME_WEBSTORE_BASE_URL}/items/${extensionId}`).
        query({ uploadType: 'media' }).
        set({"Authorization":`Bearer ${accessToken}`}).
        send(zip)
        const chromeWebStoreResponse = extensionResponse.body as TChromeWebStoreResponse
        if(chromeWebStoreResponse.uploadState === UploadState.FAILURE || chromeWebStoreResponse.uploadState === UploadState.NOT_FOUND) {
            throw new Error(`Failed to upload chrome extension build\nuploadStatus: ${chromeWebStoreResponse.uploadState}\nerrorDetail: ${chromeWebStoreResponse.itemError.at(0)?.error_detail}`)
        }
        return chromeWebStoreResponse
    } catch (error) {
        throw error
    }
}

if(require.main === module){
    run()
}