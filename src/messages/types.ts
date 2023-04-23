export type MessageFromClient = {
  content: string;
  authorUsername: string;
  authorId: string;
  public: boolean;
  to: string | null;
};

export type Message = {
  timestamp: string;
  id: string;
} & MessageFromClient;
