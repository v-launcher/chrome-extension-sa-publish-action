import { describe , expect , test ,  } from "@jest/globals"
import { readFileSync } from "node:fs"
import { generateJWT } from "../../src/utils/token"
import { log } from "console"

describe("token module",()=>{
    test("generate jwt",async ()=>{
        const key = readFileSync("key.json","utf8")
        const jwt = generateJWT(JSON.parse(key),"support@codimite.com")
        const accessToken = await jwt.getAccessToken()
        log(accessToken)
    })
})