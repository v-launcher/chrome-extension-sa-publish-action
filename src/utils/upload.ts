import { put } from "superagent"
import TChromeWebStoreResponse, { UploadState } from "../types/TChromeWebstoreResponse"
import { CHROME_WEBSTORE_BASE_URL } from "../types/const"

export default async function upload(zip: Buffer<ArrayBufferLike> , accessToken: string | undefined | null , extensionId: string): Promise<TChromeWebStoreResponse> {
    try {
        if (typeof accessToken !== "string") {
            throw Error("Invalid OAuth2 Access Token")
        }
        const extensionResponse = await put(`${CHROME_WEBSTORE_BASE_URL}/items/${extensionId}`).
        query({ uploadType: 'media' }).
        set({"Authorization":`Bearer ${accessToken}`}).
        send(zip)
        const chromeWebStoreResponse = extensionResponse.body as TChromeWebStoreResponse
        console.log(chromeWebStoreResponse)
        if(chromeWebStoreResponse.uploadState === UploadState.FAILURE || chromeWebStoreResponse.uploadState === UploadState.NOT_FOUND) {
            throw new Error(`Failed to upload chrome extension build\nuploadStatus: ${chromeWebStoreResponse.uploadState}\nerrorDetail: ${chromeWebStoreResponse.itemError.at(0)?.error_detail}`)
        }
        return chromeWebStoreResponse
    } catch (error) {
        throw error
    }
}
