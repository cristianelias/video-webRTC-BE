import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { MessageFromClient } from "./messages/types";
import { getUsernameFromSocket } from "./users/utils";
import { UsersStore } from "./users/UsersStore";
import { initMessage } from "./messages/utils";

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

  socket.on("message", (payload: MessageFromClient) => {
    const messageFromServer = initMessage(payload);

    io.emit("message", messageFromServer);
  });
});

const registerUser = (socket: Socket) => {
  const username = getUsernameFromSocket(socket);
  usersStore.addUser(username, socket.id);
  const users = usersStore.getUsers();

  console.log(`${username} just connected to the session!`);
  socket.emit("users", users); // send the current user list to the new user
  socket.broadcast.emit("users", users); // send the updated user list to other users
};

const unRegisterUser = (socket: Socket) => {
  const username = getUsernameFromSocket(socket);

  console.log(`${username} disconnected from the session!`);

  usersStore.removeUser(socket.id);
  socket.broadcast.emit("users", usersStore.getUsers()); // send the updated user list to other users
};
