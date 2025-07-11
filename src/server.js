import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import yaml from "js-yaml";
import path from "path";
import fs from "fs";
require('dotenv').config();

let app = express();

// Cho phép CORS từ frontend (localhost:5173)
app.use(cors({
    origin: 'http://localhost:5173',  // frontend Vite
    credentials: true                 // nếu bạn dùng cookie/session
}));

// config app

// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));

// limit size
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Swagger setup
const swaggerPath = path.join(__dirname, "./docs/swagger.yaml");
const swaggerDocument = yaml.load(fs.readFileSync(swaggerPath, "utf8"));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 6969; // nếu port === undefined thì port được gắn vào giá trị 6969
app.listen(port, () => {
    // callback
    console.log("Backend NodeJS is running on the port: " + port)
    console.log(`Swagger UI: http://localhost:${port}/api-docs`);
})

