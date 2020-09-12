import { Router } from 'express';
import { adaptRoute } from '@/bin/configuration/adapters/express-route-adapter';
import { auth } from '@/bin/middlewares/auth';
import { makeSaveRatingResultsController } from '@/modules/rating/factories/controllers/save-rating-result-controller-factory';
import { makeLoadRatingResultsController } from '@/modules/rating/factories/controllers/load-rating-result-controller-factory';
const router = Router();
router.put(
  '/:ratingId/:ratingFor/results',
  auth,
  adaptRoute(makeSaveRatingResultsController()),
);
router.get(
  '/:ratingId/:ratingFor/results',
  auth,
  adaptRoute(makeLoadRatingResultsController()),
);
export default router;
