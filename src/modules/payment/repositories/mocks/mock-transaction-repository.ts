import { TransactionModel } from '../../models/transaction-model';
import { mockFakeTransaction } from '../../models/mocks/mock-transaction';
import { AddTransactionRepository } from '../transaction/protocols/add-transaction-repository';

export const mockAddTransactionRepository = (): AddTransactionRepository => {
  class AddTransactionRepositoryStub implements AddTransactionRepository {
    transactionModel = mockFakeTransaction();
    async add(
      transactionData: Omit<TransactionModel, '_id'>,
    ): Promise<TransactionModel> {
      return new Promise((resolve) => resolve(this.transactionModel));
    }
  }
  return new AddTransactionRepositoryStub();
};
