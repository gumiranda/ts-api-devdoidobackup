import { adaptRoute } from '@/bin/configuration/adapters/express-route-adapter';
import { ownerAuth } from '@/bin/middlewares';
import { Router } from 'express';
import { makeDeleteCardByIdController } from '../factories/controllers/delete-card-by-id-factory';
import { makeLoadCardByPageController } from '../factories/controllers/load-card-by-page-factory-controller';

const router = Router();

router.get('/:page', ownerAuth, adaptRoute(makeLoadCardByPageController()));
router.delete(
  '/:cardId',
  ownerAuth,
  adaptRoute(makeDeleteCardByIdController()),
);

export default router;
