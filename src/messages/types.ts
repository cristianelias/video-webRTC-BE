export type MessageFromClient = {
  id: string;
  username: string;
  content: string;
  public: boolean;
  to?: string;
  from?: string;
};

export type Message = {
  timestamp: string;
} & MessageFromClient;
