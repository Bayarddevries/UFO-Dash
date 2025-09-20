export enum FOIAStatus {
  Submitted = 'Submitted',
  InProgress = 'In Progress',
  Completed = 'Completed',
  Denied = 'Denied',
}

export interface FOIARequest {
  id: string;
  subject: string;
  status: FOIAStatus;
  date: string;
}

export interface UfoFile {
  id: string;
  name: string;
  description: string;
  added: string;
}

export interface NewsArticle {
  title: string;
  uri: string;
  summary: string;
}

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export enum MessageSender {
  User = 'user',
  Model = 'model',
}

export interface ChatMessage {
  id: string;
  sender: MessageSender;
  text: string;
  isStreaming?: boolean;
}