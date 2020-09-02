import { Router } from 'express';
import { adaptRoute } from '@/bin/configuration/adapters/express-route-adapter';
import { auth } from '@/bin/middlewares/auth';
import { makeSaveRatingResultsController } from '../factories/save-rating-result-controller-factory';
const router = Router();
router.put(
  '/:ratingId/results',
  auth,
  adaptRoute(makeSaveRatingResultsController()),
);
export default router;
