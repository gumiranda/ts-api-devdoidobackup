import { CardModel } from '@/modules/payment/models/card-model';

export interface DeleteCardByIdRepository {
  cardModel: CardModel;
  _id: string;
  deleteById(_id: string, userId: string): Promise<CardModel>;
}
