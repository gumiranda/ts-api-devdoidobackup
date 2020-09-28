import { MongoRepository } from '@/bin/repository/mongo-repository';
import { ChatMongoRepository } from '@/modules/chat/repositories/chat-mongo-repository';
import { AddChat } from '@/modules/chat/usecases/add-chat/add-chat';
import { DbAddChat } from '@/modules/chat/usecases/add-chat/db/db-add-chat';
import { UserMongoRepository } from '@/modules/user/repositories/user-mongo-repository';
export const makeDbAddChat = (): AddChat => {
  const mongoRepository = new MongoRepository('chats');
  const mongoUserRepository = new MongoRepository('users');
  const userMongoRepository = new UserMongoRepository(mongoUserRepository);
  const chatMongoRepository = new ChatMongoRepository(mongoRepository);
  return new DbAddChat(chatMongoRepository, userMongoRepository);
};
