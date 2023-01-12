import express from "express";
import { DB_URI, PORT } from "./config";
import routes from "./routes";
import errorHandler from "./middlewares/errorHandler";
import mongoose from "mongoose";
import path from "path";
const app = express();
const port = PORT || 8080;

mongoose.connect(DB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", () => {
  console.log("DB connected ...");
});

global.appRoot = path.resolve(__dirname);
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use(express.json());
app.use("/api", routes);
app.use('/uploads' , express.static('uploads'))
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
