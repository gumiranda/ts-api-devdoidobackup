import { TransactionModel } from '../../models/transaction-model';

export type AddTransactionModel = Omit<TransactionModel, '_id'>;

export type AddTransaction = {
  add(transaction: AddTransactionModel): Promise<TransactionModel>;
};
