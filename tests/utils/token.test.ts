import { describe , expect , test ,  } from "@jest/globals"
import { readFileSync } from "node:fs"
import { generateJWT } from "../../src/utils/token"
import { log } from "console"
import upload from "../../src/utils/upload"
import publish from "../../src/utils/publish"

describe("Utils",()=>{
    test("generate jwt",async ()=>{
        const key = readFileSync("key.json","utf8")
        const jwt = generateJWT(JSON.parse(key),"support@codimite.com")
        const accessToken = await jwt.getAccessToken()
        log(accessToken)
    })

    test("Upload extension", async()=>{
        const zip = readFileSync("build/build.zip")
        const key = readFileSync("key.json","utf8")
        const jwt = generateJWT(JSON.parse(key),"support@codimite.com")
        const accessToken = await jwt.getAccessToken()
        await upload(zip,accessToken.token, "mjlddmafnfkcdhkhflpijikbcapnioob")
    }, 5000 * 60)

    test("Publish extension", async()=>{
        const key = readFileSync("key.json","utf8")
        const jwt = generateJWT(JSON.parse(key),"support@codimite.com")
        const accessToken = await jwt.getAccessToken()
        await publish(accessToken.token, "mjlddmafnfkcdhkhflpijikbcapnioob")
    }, 5000 * 60)
})