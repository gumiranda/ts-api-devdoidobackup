import { TransactionModel } from '@/modules/payment/models/transaction-model';
import { AddTransactionRepository } from '@/modules/payment/repositories/transaction/protocols/add-transaction-repository';
import { AddTransaction, AddTransactionModel } from '../add-transaction';

export class DbAddTransaction implements AddTransaction {
  private readonly addTransactionRepository: AddTransactionRepository;

  constructor(addTransactionRepository: AddTransactionRepository) {
    this.addTransactionRepository = addTransactionRepository;
  }

  async add(transactionData: AddTransactionModel): Promise<TransactionModel> {
    const transaction = await this.addTransactionRepository.add(
      transactionData,
    );
    return transaction;
  }
}
