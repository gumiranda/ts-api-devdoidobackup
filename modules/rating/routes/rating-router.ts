import { Router } from 'express';
import { makeAddRatingController } from '../factories/add-rating-factory';
import { adaptRoute } from '../../../bin/configuration/adapters/express-route-adapter';
import { makeAuthMiddleware } from '../../../bin/patterns/factories/middlewares/auth-middleware-factory';
import { adaptMiddleware } from '../../../bin/configuration/adapters/express-middleware-adapter';
const router = Router();
const adminAuth = adaptMiddleware(makeAuthMiddleware('admin'));
router.post('/add', adminAuth, adaptRoute(makeAddRatingController()));
export default router;
