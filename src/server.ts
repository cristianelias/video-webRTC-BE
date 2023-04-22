import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { Message } from "./messages/types";
import { getUsernameFromSocket } from "./utils/utils";
import { UsersStore } from "./users/UsersStore";

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

if (process.env.HTTP_PORT === undefined) {
  throw new Error("🫠 Oh no! You forgot to set the PORT environment variable!");
}

const httpPort = parseInt(process.env.HTTP_PORT);

httpServer.listen(httpPort, () => {
  console.log(`🐙 HTTP server is running on port: ${httpPort}`);
});

const usersStore = new UsersStore();

io.on("connection", (socket: Socket) => {
  registerUser(socket);

  // For debugging purposes
  socket.onAny((event, ...args) => {
    console.log(event, args);
  });

  socket.on("disconnect", () => {
    unRegisterUser(socket);
  });

  socket.on("message", (payload: Message) => {
    io.emit("message", payload);
  });
});

const registerUser = (socket: Socket) => {
  const username = getUsernameFromSocket(socket);

  console.log(`${username} just connected to the session!`);

  const user = {
    name: username,
    id: socket.id,
  };

  usersStore.addUser(user);
  socket.broadcast.emit("users", usersStore.getUsers());
  socket.emit("users", usersStore.getUsers());
};

const unRegisterUser = (socket: Socket) => {
  const username = getUsernameFromSocket(socket);

  console.log(`${username} disconnected from the session!`);

  usersStore.removeUser(socket.id);
  socket.broadcast.emit("users", usersStore.getUsers());
};
