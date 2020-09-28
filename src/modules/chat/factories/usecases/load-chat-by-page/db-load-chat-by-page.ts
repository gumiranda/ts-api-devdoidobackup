import { MongoRepository } from '@/bin/repository/mongo-repository';
import { ChatMongoRepository } from '@/modules/chat/repositories/chat-mongo-repository';
import { DbLoadChatByPage } from '@/modules/chat/usecases/load-chat-by-page/db/db-load-chat-by-page';
import { LoadChatByPage } from '@/modules/chat/usecases/load-chat-by-page/load-chat-by-page';

export const makeDbLoadChatByPage = (): LoadChatByPage => {
  const mongoRepository = new MongoRepository('chats');
  const chatMongoRepository = new ChatMongoRepository(mongoRepository);
  return new DbLoadChatByPage(chatMongoRepository);
};
