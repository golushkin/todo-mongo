import express from "express";
import config from "config";
import { Config } from "./types/config";

const app = express();
const serverConfig = config.get<Config["server"]>("server");

app.use((req, res) => res.json({ a: 1 }));

app.listen(serverConfig.port, () =>
  console.log("listen on " + serverConfig.port)
);
