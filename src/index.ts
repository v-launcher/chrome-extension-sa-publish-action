import { getInput , info, setFailed ,error as errorLog } from "@actions/core"
import axios, { isAxiosError } from "axios"
import jwt from "jsonwebtoken"
import fs from "node:fs"

async function run():Promise<void>{
    try {
        const serviceAccount = JSON.parse(getInput("service-account-json",{required: true}))
        info("Email"+serviceAccount.client_email)
        const folderPath = getInput("path",{
            required: true
        })
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
        const requestBody = new URLSearchParams({
            grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
            assertion: idToken
        }) 
        // const response = await axios.post("https://oauth2.googleapis.com/token",requestBody.toString(),{
        //     headers: { "Content-Type": "application/x-www-form-urlencoded"}
        // })
        // const extensionId = getInput("chrome-extension-id")
        const fileList = fs.readdirSync("./")
        fileList.forEach((fileName)=>{
            info(fileName)
        })
        const pathFiles = fs.readdirSync(folderPath)
        pathFiles.forEach((fileName: string)=>{
            info(fileName)
        })
    } catch (error: any) {
        if (isAxiosError(error)){
            setFailed(error.response?.data)
            return
        }
        setFailed(error.message)
    }
}

if(require.main === module){
    run()
}