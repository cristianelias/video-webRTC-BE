export type MessageFromClient = {
  content: string;
  authorUsername: string;
  authorId: string;
  public: boolean;
  to: string | null;
  from: string | null;
};

export type Message = {
  timestamp: string;
  id: string;
} & MessageFromClient;
