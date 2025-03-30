import { post } from "superagent"
import { CHROME_WEBSTORE_BASE_URL } from "../types/const"

async function publish(accessToken: string | undefined | null , extensionId: string) {
    try {
        if (typeof accessToken !== "string") {
            throw Error("Invalid OAuth2 Access Token")
        }
        await post(`${CHROME_WEBSTORE_BASE_URL}/v1.1/items/${extensionId}/publish`).
        set({ "Authorization": `Bearer ${accessToken}` })
    } catch (error) {
        throw error
    }
}

export default publish