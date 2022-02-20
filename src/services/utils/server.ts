import cors from "cors";
import express from "express";
import { handleError } from "../../helper/error";
import { mainServerRouter } from "../../routes/_mainRouter";

var bodyParser = require("body-parser");

const app = express();
const port = 5565;

export const createServer = async () => {
  serverConfiguration();
  serverRouting();
  serverErrorHandeling();
  return app;
};

export const startServer = async () => {
  return new Promise((resolve, reject) => {
    app.listen(port, () => {
      resolve(true);
      return console.log(`server is listening on ${port}`);
    });
  });
};

const serverConfiguration = () => {
  app.use(cors());
  app.use(function (err: any, req: any, res: any, next: any) {
    // Website allowed to connect
    res.setHeader("Access-Control-Allow-Origin", "*");

    // Request methods allowed
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, OPTIONS, PUT, PATCH, DELETE"
    );

    // Request headers allowed
    res.setHeader("Access-Control-Allow-Headers", "content-type");

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader("Access-Control-Allow-Credentials", false);
    res.setHeader("content-type", "application/json");

    next();
    next(err);
    res.status(500).send("Something broke!");
  });

  app.use(bodyParser.json({ limit: "50mb" }));
  app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

  app.set("x-powered-by", false);
};
const serverRouting = () => {
  mainServerRouter(app);
};
const serverErrorHandeling = () => {
  app.use((err: any, req: any, res: any, next: any) => {
    if (res.name == "next") {
      // appel ne correspondant à aucune route => l'objet res est en fait dans l'objet req car err n'existe pas
      return req.status(404).json({ error: "not found" });
    } else {
      handleError(err, req, res, next);
    }
  });
};

module.exports.app = app;
