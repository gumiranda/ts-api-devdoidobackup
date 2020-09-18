import { CardModel } from '@/modules/payment/models/card-model';

export interface AddCardRepository {
  add(cardData: Omit<CardModel, '_id'>): Promise<CardModel>;
}
