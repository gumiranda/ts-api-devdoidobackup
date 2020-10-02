import { ownerAuth } from '@/bin/middlewares/owner-auth';
import { Router } from 'express';
import { adaptRoute } from '@/bin/configuration/adapters/express-route-adapter';
import { makeAddCategoryController } from '../factories/controllers/add-category-factory-controller';

const router = Router();
router.post('/', ownerAuth, adaptRoute(makeAddCategoryController()));
export default router;
