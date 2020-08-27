import { Router } from 'express';
import { makeSignUpController } from '../factories/signup-factory';
import { adaptRoute } from '../../../bin/configuration/adapters/express-route-adapter';
import { makeLoginController } from '../factories/login-factory';
const router = Router();
router.post('/signup', adaptRoute(makeSignUpController()));
router.post('/login', adaptRoute(makeLoginController()));
export default router;
