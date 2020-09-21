import { mockFakeTransaction } from '../../models/mocks/mock-transaction';
import { TransactionModel } from '../../models/transaction-model';
import {
  AddTransaction,
  AddTransactionModel,
} from '../add-transaction/add-transaction';

export const mockAddTransaction = (): AddTransaction => {
  class AddTransactionStub implements AddTransaction {
    transactionModel = mockFakeTransaction();
    async add(transaction: AddTransactionModel): Promise<TransactionModel> {
      return new Promise((resolve) => resolve(this.transactionModel));
    }
  }
  return new AddTransactionStub();
};
