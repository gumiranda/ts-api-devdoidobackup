import { adaptRoute } from '@/bin/configuration/adapters/express-route-adapter';
import { ownerAuth } from '@/bin/middlewares';
import { Router } from 'express';
import { makeTransactionController } from '../factories/controllers/add-transaction-factory-controller';

const router = Router();

router.post('/', ownerAuth, adaptRoute(makeTransactionController()));

export default router;
