import { Router } from 'express';
import { adaptRoute } from '@/bin/configuration/adapters/express-route-adapter';
import { auth } from '@/bin/middlewares/auth';
import { makeAddNotificationController } from '../factories/controllers/add-notification-factory-controller';
import { makeLoadNotificationByPageController } from '../factories/controllers/load-notification-by-page-factory-controller';
import { makeUpdateNotificationController } from '../factories/controllers/update-notification-factory-controller';
const router = Router();
router.post('/', auth, adaptRoute(makeAddNotificationController()));
router.put(
  '/:notificationId',
  auth,
  adaptRoute(makeUpdateNotificationController()),
);
router.get('/:page', auth, adaptRoute(makeLoadNotificationByPageController()));
export default router;
