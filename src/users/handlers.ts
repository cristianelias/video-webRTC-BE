import { Socket } from "socket.io";
import { getUsernameFromSocket } from "./utils";
import { UsersStore } from "./UsersStore";

const usersStore = new UsersStore();

export const handleUserConnection = (socket: Socket) => {
  const username = getUsernameFromSocket(socket);
  usersStore.addUser(username, socket.id);
  const users = usersStore.getUsers();

  console.log(`${username} just connected to the session!`);
  socket.emit("users", users); // send the current user list to the new user
  socket.broadcast.emit("users", users); // send the updated user list to other users
};

export const handleUserDisconnection = (socket: Socket) => {
  const username = getUsernameFromSocket(socket);

  console.log(`${username} disconnected from the session!`);

  usersStore.removeUser(socket.id);
  socket.broadcast.emit("users", usersStore.getUsers()); // send the updated user list to other users
};
