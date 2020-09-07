import { Router } from 'express';
import { makeSignUpController } from '@/modules/account/factories/controllers/signup-factory-controller';
import { adaptRoute } from '@/bin/configuration/adapters/express-route-adapter';
import { makeLoginController } from '@/modules/account/factories/controllers/login-factory-controller';
import { makeLoadAccountByPageController } from '@/modules/account/factories/controllers/load-account-by-page-factory-controller';
import { auth } from '@/bin/middlewares/auth';
import { makeCompleteRegisterController } from '../factories/controllers/update-account-factory-controller';
const router = Router();
router.post('/register', adaptRoute(makeSignUpController()));
router.post('/authenticate', adaptRoute(makeLoginController()));
router.get('/page/:page', auth, adaptRoute(makeLoadAccountByPageController()));
router.put(
  '/completeRegister',
  auth,
  adaptRoute(makeCompleteRegisterController()),
);
export default router;
