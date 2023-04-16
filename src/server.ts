import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server, Socket } from "socket.io";

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "https://video-webrtc-fe.onrender.com"],
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
// const webSocketPort = parseInt(process.env.WEBSOCKET_PORT);
// io.listen(webSocketPort);

httpServer.listen(httpPort, () => {
  console.log(`🐙 HTTP server is running on port: ${httpPort}`);
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
