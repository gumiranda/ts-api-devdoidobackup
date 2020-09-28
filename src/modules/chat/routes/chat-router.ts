import { Router } from 'express';
import { adaptRoute } from '@/bin/configuration/adapters/express-route-adapter';
import { auth } from '@/bin/middlewares/auth';
import { makeAddChatController } from '../factories/controllers/add-chat-factory-controller';
import { makeLoadChatByPageController } from '../factories/controllers/load-chat-by-page-factory-controller';
import { makeUpdateChatController } from '../factories/controllers/update-chat-factory-controller';
import { makeLoadMessagesByPageController } from '../factories/controllers/load-messages-by-page-factory-controller';
const router = Router();
router.post('/', auth, adaptRoute(makeAddChatController()));
router.put('/:chatId', auth, adaptRoute(makeUpdateChatController()));
router.get('/:page', auth, adaptRoute(makeLoadChatByPageController()));
router.get(
  '/:chatId/page/:page',
  auth,
  adaptRoute(makeLoadMessagesByPageController()),
);
//'/chat/:id/page/:page'
export default router;
