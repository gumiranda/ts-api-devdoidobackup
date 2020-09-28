import { MongoRepository } from '@/bin/repository/mongo-repository';
import { ChatMongoRepository } from '@/modules/chat/repositories/chat-mongo-repository';
import { DbUpdateChat } from '@/modules/chat/usecases/update-chat/db/db-update-chat';
import { UpdateChat } from '@/modules/chat/usecases/update-chat/update-chat';

export const makeDbUpdateChat = (): UpdateChat => {
  const mongoRepository = new MongoRepository('chats');
  const chatMongoRepository = new ChatMongoRepository(mongoRepository);
  return new DbUpdateChat(chatMongoRepository);
};
