import { MongoRepository } from '@/bin/repository/mongo-repository';
import { ChatMongoRepository } from '@/modules/chat/repositories/chat-mongo-repository';
import { DbLoadChatById } from '@/modules/chat/usecases/load-chat-by-id/db/db-load-chat-by-id';
import { LoadChatById } from '@/modules/chat/usecases/load-chat-by-id/load-chat-by-id';

export const makeDbLoadChatById = (): LoadChatById => {
  const mongoRepository = new MongoRepository('chats');
  const chatMongoRepository = new ChatMongoRepository(mongoRepository);
  return new DbLoadChatById(chatMongoRepository);
};
