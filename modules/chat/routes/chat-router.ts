import { Router } from 'express';
import controller from '../controllers/chat-controller';
import { auth } from '../../../middlewares/authentication';

const _ctrl = new controller();
export default (router: Router): void => {
  router.post('/chat/', auth, _ctrl.post);
  router.put('/chat/delete/:id/:id2', auth, _ctrl.deleteMessage); //id é do chat e id 2 eh da mensagem
  router.get('/chat/page/:page', auth, _ctrl.getMyChats);
  router.get('/chat/:id/page/:page', auth, _ctrl.getByIdPaginate);
  router.put('/chat/send/:id', auth, _ctrl.sendMessage);
  router.delete('/chat/:id', auth, _ctrl.delete);
};
