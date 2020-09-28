export type Message = {
  text: string;
  createdAt: Date;
  user: string;
  read: boolean;
};
export type ChatModel = {
  _id: string;
  lastMessage: string;
  countMessages: Number;
  userFor: string;
  userBy: string;
  messages: Message[];
  createdAt?: Date;
};
export type ChatsPaginate = {
  chats: Omit<ChatModel, 'messages'>[];
  chatsCount: number;
};
export type MessagesPaginate = {
  messages: Message[];
  messagesCount: number;
};
export type ChatData = Omit<
  ChatModel,
  'userFor' | 'userBy' | '_id' | 'createdAt'
>;
