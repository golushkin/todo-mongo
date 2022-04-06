import express from "express";
import config from "config";
import { Config } from "./types/config";
import router from './routes/index'
import { httpLoggerMiddleware } from './middlewares/logger'
import { handle404 } from "./helpers/errorHandler";
import DbHelper from "./helpers/DbHelper";
import logger from "./helpers/logger";
import { closeAll } from "./helpers/stopHelper";

const app = express();
const serverConfig = config.get<Config["server"]>("server");

app.use(httpLoggerMiddleware)
app.use(router);
app.use(handle404)

async function start(){
  try {
    await DbHelper.connect()
  } catch (error) {
    logger.error(error)
  }

  process.on('SIGINT', closeAll)
  process.on('SIGTERM', closeAll)

  app.listen(serverConfig.port, () => console.log("listen on " + serverConfig.port));
}

start()