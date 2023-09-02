import express from "express";
import http from "http";
import dotenv from "dotenv";
import connectMongoDb from "@configs/database";
import router from "@routes/index";
import { WebSocketServer } from "ws";

dotenv.config();
connectMongoDb();

// API
const app = express();
const server = http.createServer(app);

app.use(express.json());

const port = (process.env.PORT || 3000) as number;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use("/api/v1", router());

// Websocket
const wss = new WebSocketServer({
  port: Number(port) + 1 || 3000,
});
console.log(`WebSocket is running on port ${Number(port) + 1}`);

wss.on("connection", (ws) => {
  ws.on("message", (data) => {
    ws.send(data.toString());
  });

  ws.on("error", console.error);
});
