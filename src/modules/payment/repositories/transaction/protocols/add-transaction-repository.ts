import { TransactionModel } from '@/modules/payment/models/transaction-model';

export interface AddTransactionRepository {
  transactionModel: TransactionModel;
  add(
    transactionData: Omit<TransactionModel, '_id'>,
  ): Promise<TransactionModel>;
}
