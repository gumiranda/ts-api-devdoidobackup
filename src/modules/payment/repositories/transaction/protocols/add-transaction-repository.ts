import { TransactionModel } from '@/modules/payment/models/transaction-model';

export interface AddTransactionRepository {
  add(
    transactionData: Omit<TransactionModel, '_id'>,
  ): Promise<TransactionModel>;
}
