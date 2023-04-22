export interface PublicMessage {
  id: string;
  username: string;
  content: string;
  timeStamp: number;
}

export interface PrivateMessage {
  to: string;
  from: string;
}

export type Message = PublicMessage | PrivateMessage;
