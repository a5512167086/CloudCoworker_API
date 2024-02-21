import express from "express";
import http from "http";
import dotenv from "dotenv";
import connectMongoDb from "@configs/database";
import router from "@routes/index";
import { WebSocketServer } from "ws";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";

dotenv.config();
connectMongoDb();

// API
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

const port = (process.env.PORT || 3000) as number;
server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.use("/api/v1", router());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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
