import { Request } from "express"

class Logger {
    info(msg: string){
        console.log(msg)
    }

    error(err: Error){
        console.error(err)
    }

    http(req: Request){
        const time = (new Date()).toLocaleTimeString()
        const url = req.url
        const method = req.method

        console.log(`${url} ${method} ${time}`)
    }
}

export default new Logger()