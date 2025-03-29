import { getInput , info, setFailed , } from "@actions/core"
import axios from "axios"
async function run():Promise<void>{
    try {
        const requestBody = new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: getInput("self-signed-jwt")
        })
        info(requestBody.toString())
        const response = await axios.post("https://oauth2.googleapis.com/token")
        info(response.data.access_token)
    } catch (error: any) {
        setFailed(error.message)
    }
}

run()