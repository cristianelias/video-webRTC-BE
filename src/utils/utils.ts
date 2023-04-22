import { Socket } from "socket.io";

export const getUsernameFromSocket = (socket: Socket): string =>
  socket.handshake.auth.username;
