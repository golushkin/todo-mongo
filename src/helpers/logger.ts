import { Request } from "express"

class Logger {
  log(msg: string){
    if (process.env.NODE_ENV !== "test") {
      console.log(msg)
    }
  }

  info(msg: string){
    this.log(`[INFO]: ${msg}`)
  }

  error(err: Error){
    console.error(err)
  }

  http(req: Request){
    const time = (new Date()).toLocaleTimeString()
    const url = req.url
    const method = req.method

    this.log(`[REQUEST] ${url} ${method} ${time}`)
  }
}

export default new Logger()