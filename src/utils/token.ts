import { JWT } from "google-auth-library"
import TGoogleServiceAccount from "../types/TServiceAccount"

export function generateJWT(keyFile: TGoogleServiceAccount , sub: string):JWT {
    const client = new JWT({
        email: keyFile.client_email,
        subject: sub,
        scopes: ["https://www.googleapis.com/auth/chromewebstore"],
        key: keyFile.private_key,
    })
    return client
}