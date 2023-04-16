import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import http from "http";

dotenv.config();

const app: Express = express();
const httpServer = http.createServer(app);

import { Server as SocketIOServer, Socket } from "socket.io";
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: ["http://localhost:5173/", "https://video-webrtc-fe.onrender.com/"],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

if (
  process.env.HTTP_PORT === undefined ||
  process.env.WEBSOCKET_PORT === undefined
) {
  throw new Error("🫠 Oh no! You forgot to set the PORT environment variable!");
}

const httpPort = parseInt(process.env.HTTP_PORT);
const webSocketPort = parseInt(process.env.WEBSOCKET_PORT);
io.listen(webSocketPort);

app.listen(httpPort, () => {
  console.log(`🐙 Server is running at http://localhost:${httpPort}`);
});

type Message = {
  authorName: string;
  authorId: string;
  content: string;
};

io.on("connection", (socket: Socket) => {
  const messages = <Message[]>[];

  console.log("a user connected");

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });

  socket.on("message", (payload) => {
    console.log(payload);

    io.emit("message", payload);
  });
});
