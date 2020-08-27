import { Router } from 'express';
import controller from '../controllers/user-controller';
import { auth } from '../../../middlewares/authentication';

const _ctrl = new controller();
export default (router: Router): void => {
  router.post('/user/register', _ctrl.post);
  router.post('/user/authenticate', _ctrl.authenticate);
  router.put('/user/completeRegister', auth, _ctrl.completeRegister);
  router.get('/user/', auth, _ctrl.get);
  router.get('/user/page/:page', auth, _ctrl.getByPage);
  router.put('/user/:id', auth, _ctrl.put);
  router.delete('/user/:id', auth, _ctrl.delete);
};
