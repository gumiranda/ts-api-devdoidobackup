import { CardModel } from '@/modules/payment/models/card-model';

export interface AddCardRepository {
  cardModel: CardModel;
  add(cardData: Omit<CardModel, '_id'>): Promise<CardModel>;
}
