import { Router } from 'express';
import controller from '../controllers/notification-controller';
import { auth } from '../../../middlewares/authentication';

const _ctrl = new controller();
export default (router: Router): void => {
  router.get('/notification/', auth, _ctrl.get);
  router.get('/notification/:id', auth, _ctrl.getById);
  router.get('/notification/page/:page', auth, _ctrl.getMy);
  router.post('/notification/', auth, _ctrl.post);
  router.put('/notification/:id', auth, _ctrl.put);
  router.delete('/notification/:id', auth, _ctrl.remove);
};
