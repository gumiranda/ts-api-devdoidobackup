import { mockFakeUserUpdated } from '@/modules/user/models/mocks/mock-user';
import { UserModel } from '@/modules/user/models/user-model';
import { mockFakeTransaction } from '../../models/mocks/mock-transaction';
import {
  TransactionModel,
  TransactionModelRequest,
} from '../../models/transaction-model';
import {
  AddTransaction,
  AddTransactionModel,
} from '../add-transaction/add-transaction';
import { PayAgain } from '../pay-again/pay-again';
import { PayOnce } from '../pay-once/pay-once';
import { UpdatePayDay } from '../update-pay-day/update-pay-day';

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
export const mockPayAgain = (): PayAgain => {
  class PayAgainStub implements PayAgain {
    payEasy(userId: string): Promise<TransactionModel> {
      return new Promise((resolve) => resolve(this.transactionModel));
    }
    payAgain(
      cardId: string,
      value: Number,
      userId: string,
    ): Promise<TransactionModel> {
      return new Promise((resolve) => resolve(this.transactionModel));
    }
    transactionModel = mockFakeTransaction();
  }
  return new PayAgainStub();
};
export const mockUpdatePayDay = (): UpdatePayDay => {
  class UpdatePayDayStub implements UpdatePayDay {
    updatePayDay(
      userId: string,
      numberDays: Number,
    ): Promise<Omit<UserModel, 'password'>> {
      return new Promise((resolve) => resolve(this.userModel));
    }
    userModel = mockFakeUserUpdated('owner');
  }
  return new UpdatePayDayStub();
};
