import { uuid } from "uuidv4";
import { MessageFromClient } from "./types";
import { Socket } from "socket.io";
import { io } from "../server";

const _initMessage = (fromClient: MessageFromClient) => {
  // This is the place where additional properties can be added to the message
  // before it is sent to the client.
  // Validation can also be done here.

  return {
    ...fromClient,
    timestamp: new Date().toISOString(),
    id: uuid(),
  };
};

const _handlePrivateMessage = (socket: Socket, messageFromServer: any) => {
  for (let [currentSocketId, currentSocket] of io.of("/").sockets) {
    if (
      messageFromServer.from === currentSocketId ||
      messageFromServer.to === currentSocketId
    ) {
      currentSocket.emit("message", messageFromServer);
      console.log("emitted private message", messageFromServer);
    }
  }
};

const _handlePublicMessage = (socket: Socket, messageFromServer: any) => {
  io.emit("message", messageFromServer);
  console.log("emitted public message", messageFromServer);
};

export const handleMessage = (socket: Socket, payload: MessageFromClient) => {
  const messageFromServer = _initMessage(payload);

  if (payload.public && payload.to && payload.from) {
    _handlePrivateMessage(socket, messageFromServer);
  } else {
    _handlePublicMessage(socket, messageFromServer);
  }
};
