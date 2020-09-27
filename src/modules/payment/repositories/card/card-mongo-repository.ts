import { MongoRepository } from '@/bin/repository/mongo-repository';
import { CardModel } from '../../models/card-model';
import { AddCardRepository } from './protocols/add-card-repository';
import { DeleteCardByIdRepository } from './protocols/delete-card-by-id-repository';
import { LoadCardByIdRepository } from './protocols/load-card-by-id-repository';
import { LoadCardByPageRepository } from './protocols/load-card-by-page-repository';

export class CardMongoRepository
  implements
    AddCardRepository,
    LoadCardByIdRepository,
    DeleteCardByIdRepository,
    LoadCardByPageRepository {
  constructor(private readonly mongoRepository: MongoRepository) {}
  _id: string;
  cardModel: CardModel;
  card_id: string;
  cards;
  async add(cardData: Omit<CardModel, '_id'>): Promise<CardModel> {
    const result = await this.mongoRepository.add(cardData);
    return result;
  }

  async loadById(card_id: string): Promise<CardModel> {
    const card = await this.mongoRepository.getOne({ card_id });
    return card;
  }
  async deleteById(_id: string, userId: string): Promise<CardModel> {
    const card = await this.mongoRepository.deleteOne({ _id, userId });
    return card;
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
