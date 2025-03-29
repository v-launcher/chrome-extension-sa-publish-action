import { getInput , info , error , setOutput } from "@actions/core"

try {
    // console.log("Token")
    info(getInput("self-signed-jwt"))
} catch (e: any) {
    error(e)
}