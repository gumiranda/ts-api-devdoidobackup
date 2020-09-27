import { TransactionModel } from '../../models/transaction-model';

export interface PayAgain {
  payAgain(
    cardId: string,
    value: Number,
    userId: string,
  ): Promise<TransactionModel>;
  payEasy(userId: string): Promise<TransactionModel>;
}
