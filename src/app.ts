import express from "express";
import http from "http";
import dotenv from "dotenv";
import connectMongoDb from "@configs/database";
import router from "@routes/index";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerDocument from "../swagger.json";
import { Server } from "socket.io";
import ChatRoomService, { UserData } from "@services/chatroomService";

dotenv.config();
connectMongoDb();

// API
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());

const port = (process.env.PORT || 3000) as number;

app.use("/api/v1", router());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Websocket
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

const chatRoomService = new ChatRoomService();
io.on("connection", (socket) => {
  console.log(socket.id, "已連線");

  socket.on("join", (room, req) => {
    const user: UserData = {
      id: socket.id,
      userName: req.userName,
      userEmail: req.userEmail,
      roomId: req.organization,
    };
    chatRoomService.addUser(user);
    socket.join(room);
    socket.emit("join", "Successfully joined");
    socket.broadcast.to(room).emit("join", `${user.userName}上線了`);
  });

  socket.on("message", (room, data) => {
    console.log(room, data);
    socket.emit("message", data);
    socket.broadcast.to(room).emit("message", data);
  });

  socket.on("leave", (room, data) => {
    socket.broadcast.to(room).emit("leave", `${data.username}離線了`);
    socket.leave(room);
    chatRoomService.removeUser(socket.id);
  });

  socket.on("disconnect", () => {
    const user = chatRoomService.getUser(socket.id);
    if (user) {
      socket.broadcast.to(user.roomId).emit("leave", `${user.userName}離線了`);
      socket.leave(user.roomId);
    }
    chatRoomService.removeUser(socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
