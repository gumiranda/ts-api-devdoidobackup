import { CardModel } from '@/modules/payment/models/card-model';

export interface LoadCardByIdRepository {
  cardModel: CardModel;
  card_id: string;
  loadById(card_id: string): Promise<CardModel>;
}
