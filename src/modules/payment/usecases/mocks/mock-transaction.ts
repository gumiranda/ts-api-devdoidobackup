import { mockFakeTransaction } from '../../models/mocks/mock-transaction';
import {
  TransactionModel,
  TransactionModelRequest,
} from '../../models/transaction-model';
import {
  AddTransaction,
  AddTransactionModel,
} from '../add-transaction/add-transaction';
import { PayOnce } from '../pay-once/pay-once';

export const mockAddTransaction = (): AddTransaction => {
  class AddTransactionStub implements AddTransaction {
    transactionModel = mockFakeTransaction();
    async add(transaction: AddTransactionModel): Promise<TransactionModel> {
      return new Promise((resolve) => resolve(this.transactionModel));
    }
  }
  return new AddTransactionStub();
};
export const mockPayOnce = (): PayOnce => {
  class PayOnceStub implements PayOnce {
    payOnce(
      transaction: TransactionModelRequest,
      userId: string,
    ): Promise<TransactionModel> {
      return new Promise((resolve) => resolve(this.transactionModel));
    }
    transactionModel = mockFakeTransaction();
  }
  return new PayOnceStub();
};
