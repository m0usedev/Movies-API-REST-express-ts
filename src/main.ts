import express from "express";
import { method } from "./methods";

const APP = express();
APP.disable("x-powered-by"); // Elminamos en las respuestas la propiedad "x-powered-by" que indica que usamos express

APP.use(express.json()); // El middleware express.json() convierte el cuerpo de las solicitudes HTTP en un objeto JavaScript accesible desde req.body
APP.use("/", method); // Pasamos todas las solicitudes de "/"

APP.use((_req, res) => {
  res.status(404).send("error, no existe la url");
});

const PORT = process.env.PORT ?? 1234;

APP.listen(PORT, () => {
  console.log(`http://localhost:${PORT}/`);
});
