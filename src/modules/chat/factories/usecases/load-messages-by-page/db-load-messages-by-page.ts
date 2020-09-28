import { MongoRepository } from '@/bin/repository/mongo-repository';
import { ChatMongoRepository } from '@/modules/chat/repositories/chat-mongo-repository';
import { DbLoadMessagesByPage } from '@/modules/chat/usecases/load-messages-by-page/db/db-load-messages-by-page';
import { LoadMessagesByPage } from '@/modules/chat/usecases/load-messages-by-page/load-messages-by-page';

export const makeDbLoadMessagesByPage = (): LoadMessagesByPage => {
  const mongoRepository = new MongoRepository('chats');
  const chatMongoRepository = new ChatMongoRepository(mongoRepository);
  return new DbLoadMessagesByPage(chatMongoRepository);
};
