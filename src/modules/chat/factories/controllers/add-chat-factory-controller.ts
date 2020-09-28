import { Controller } from '@/bin/protocols/controller';
import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { makeValidationComposite } from '@/bin/patterns/factories/usecases/validation/validation-factory';
import { makeDbAddChat } from '../usecases/add-chat/db-add-chat-factory';
import { AddChatController } from '../../controllers/add-chat/add-chat';

export const makeAddChatController = (): Controller => {
  const requiredFields = ['userFor'];
  const validationComposite = makeValidationComposite(requiredFields);
  const dbAddChat = makeDbAddChat();
  const chatController = new AddChatController(validationComposite, dbAddChat);
  return makeLogControllerDecorator(chatController);
};
