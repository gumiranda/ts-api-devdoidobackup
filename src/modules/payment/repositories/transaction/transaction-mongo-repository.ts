import { MongoRepository } from '@/bin/repository/mongo-repository';
import { CardModel } from '../../models/transaction-model';
import { AddCardRepository } from './protocols/add-transaction-repository';
import { LoadCardByIdRepository } from './protocols/load-transaction-by-id-repository';
import { LoadCardByPageRepository } from './protocols/load-transaction-by-page-repository';

export class CardMongoRepository
  implements
    AddCardRepository,
    LoadCardByIdRepository,
    LoadCardByPageRepository {
  constructor(private readonly mongoRepository: MongoRepository) {}
  transactionModel: CardModel;
  transaction_id: string;

  async add(transactionData: Omit<CardModel, '_id'>): Promise<CardModel> {
    const result = await this.mongoRepository.add(transactionData);
    return result;
  }

  async loadById(transaction_id: string): Promise<CardModel> {
    const transaction = await this.mongoRepository.getOne({ transaction_id });
    return transaction;
  }
  countCardsByPage(userId: string): Promise<number> {
    return this.mongoRepository.getCount({ userId });
  }
  loadByPage(page: number, userId: string): Promise<CardModel[]> {
    return this.mongoRepository.getPaginate(
      page,
      { userId },
      { createdAt: -1 },
      10,
      {},
    );
  }
}
