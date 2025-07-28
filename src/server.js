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
import http from 'http';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import {
    addUser,
    removeUserBySocket,
    getSocketByUserId
} from './utils/onlineUsers.js';
import db from './models/index.js';
require('dotenv').config();

let app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173", // frontend Vite
        methods: ["GET", "POST"]
    }
});

// Cho phép CORS từ frontend (localhost:5173)
app.use(cors({
    origin: 'http://localhost:5173',  // frontend Vite
    credentials: true                 // nếu bạn dùng cookie/session
}));

// config app
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
// SOCKET.IO logic
io.on("connection", (socket) => {
    console.log("🟢 Socket connected:", socket.id);

    socket.on("join", ({ userId }) => {
        addUser(userId, socket.id);
        console.log(`User ${userId} joined.`);
    });

    socket.on("private-message", async ({ from, to, content }) => {
        try {
            await db.Message.create({
                senderId: from,
                receiverId: to,
                content
            });

            const toSocket = getSocketByUserId(to);
            if (toSocket) {
                io.to(toSocket).emit("receive-message", {
                    from,
                    content
                });
            }
        } catch (err) {
            console.error("Send message error:", err);
        }
    });

    socket.on("disconnect", () => {
        removeUserBySocket(socket.id);
        console.log("🔴 Socket disconnected:", socket.id);
    });
});

let port = process.env.PORT || 6969; // nếu port === undefined thì port được gắn vào giá trị 6969
server.listen(port, () => {
    // callback
    console.log("Server (HTTP + Socket.IO) is running on port: " + port)
    console.log(`Swagger UI: http://localhost:${port}/api-docs`);
})

