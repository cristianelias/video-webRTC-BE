import { uuid } from "uuidv4";
import { MessageFromClient } from "./types";

export const initMessage = (fromClient: MessageFromClient) => {
  // This is the place where additional properties can be added to the message
  // before it is sent to the client.
  // Validation can also be done here.

  return {
    ...fromClient,
    timestamp: new Date().toISOString(),
    id: uuid(),
  };
};
