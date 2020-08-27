import { Router } from 'express';
import controller from '../controllers/card-controller';
import { auth } from '../../../middlewares/authentication';

const _ctrl = new controller();
export default (router: Router): void => {
  router.get('/card/', auth, _ctrl.get);
  router.delete('/card/:id', auth, _ctrl.remove);
};
