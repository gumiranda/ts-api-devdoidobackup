import { MongoRepository } from '@/bin/repository/mongo-repository';
import { TransactionModel } from '../../models/transaction-model';
import { AddTransactionRepository } from './protocols/add-transaction-repository';

export class TransactionMongoRepository implements AddTransactionRepository {
  constructor(private readonly mongoRepository: MongoRepository) {}

  async add(
    transactionData: Omit<TransactionModel, '_id'>,
  ): Promise<TransactionModel> {
    const result = await this.mongoRepository.add(transactionData);
    return result;
  }
}
