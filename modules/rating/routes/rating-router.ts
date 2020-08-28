import { Router } from 'express';
import { makeAddRatingController } from '../factories/add-rating-factory';
import { adaptRoute } from '../../../bin/configuration/adapters/express-route-adapter';
const router = Router();
router.post('/add', adaptRoute(makeAddRatingController()));
export default router;
