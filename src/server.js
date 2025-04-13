import express from "express";
import bodyParser from "body-parser";
import viewEngine from "./config/viewEngine";
import initWebRoutes from "./route/web";
import connectDB from "./config/connectDB";
import cors from "cors";
require('dotenv').config();

let app = express();

// Cho phép CORS từ frontend (localhost:5173)
app.use(cors({
    origin: 'http://localhost:5173',  // frontend Vite
    credentials: true                 // nếu bạn dùng cookie/session
}));

// config app

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

viewEngine(app);
initWebRoutes(app);

connectDB();

let port = process.env.PORT || 6969; // nếu port === undefined thì port được gắn vào giá trị 6969
app.listen(port, () => {
    // callback
    console.log("Backend NodeJS is running on the port: " + port)
})

