import { makeLogControllerDecorator } from '@/bin/patterns/factories/decorators/log-controller-decorator-factory';
import { Controller } from '@/bin/protocols/controller';
import { makeDbUpdateChat } from '../usecases/update-chat/db-update-chat-factory';
import { UpdateChatController } from '@/modules/chat/controllers/update-chat/update-chat';
import { makeValidationComposite } from '@/bin/patterns/factories/usecases/validation/validation-factory';
export const makeUpdateChatController = (): Controller => {
  const requiredFields = ['message'];
  const validationComposite = makeValidationComposite(requiredFields);

  const updateChatController = new UpdateChatController(
    validationComposite,
    makeDbUpdateChat(),
  );
  return makeLogControllerDecorator(updateChatController);
};
