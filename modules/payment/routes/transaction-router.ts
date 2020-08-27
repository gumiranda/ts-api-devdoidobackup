import { Router } from 'express';
import controller from '../controllers/transaction-controller';
import { auth } from '../../../middlewares/authentication';

const _ctrl = new controller();
export default (router: Router): void => {
  router.get('/transaction/', auth, _ctrl.get);
  router.post('/transaction/', auth, _ctrl.post);
  router.delete('/transaction/:id', auth, _ctrl.remove);
};
