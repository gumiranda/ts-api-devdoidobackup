import {
  TransactionModelRequest,
  TransactionModel,
} from '../../models/transaction-model';

export interface PayOnce {
  payOnce(
    transaction: TransactionModelRequest,
    userId: string,
  ): Promise<TransactionModel>;
}
