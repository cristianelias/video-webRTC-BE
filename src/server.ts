import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { MessageFromClient } from "./messages/types";
import { handleMessage } from "./messages/handlers";
import {
  handleUserConnection,
  handleUserDisconnection,
} from "./users/handlers";

dotenv.config();

const app: Express = express();
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:5173", "https://video-webrtc-fe.onrender.com"],
    credentials: true,
    methods: ["GET", "POST"],
  },
});

if (process.env.HTTP_PORT === undefined) {
  throw new Error("🫠 Oh no! You forgot to set the PORT environment variable!");
}

const httpPort = parseInt(process.env.HTTP_PORT);

httpServer.listen(httpPort, () => {
  console.log(`🐙 HTTP server is running on port: ${httpPort}`);
});

io.on("connection", (socket: Socket) => {
  handleUserConnection(socket);

  socket.on("disconnect", () => handleUserDisconnection(socket));

  socket.on("message", (payload: MessageFromClient) =>
    handleMessage(socket, payload)
  );
});
