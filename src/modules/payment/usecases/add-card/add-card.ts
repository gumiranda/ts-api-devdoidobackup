import { CardModel } from '../../models/card-model';

export type AddCardModel = Omit<CardModel, '_id'>;

export type AddCard = {
  add(card: AddCardModel): Promise<CardModel>;
};
