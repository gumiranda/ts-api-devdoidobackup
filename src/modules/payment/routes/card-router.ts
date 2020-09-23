import { adaptRoute } from '@/bin/configuration/adapters/express-route-adapter';
import { ownerAuth } from '@/bin/middlewares';
import { Router } from 'express';
import { makeLoadCardByPageController } from '../factories/controllers/load-card-by-page-factory-controller';

const router = Router();

router.get('/:page', ownerAuth, adaptRoute(makeLoadCardByPageController()));

export default router;
