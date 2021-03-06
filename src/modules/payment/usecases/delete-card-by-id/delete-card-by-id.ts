import { CardModel } from '../../models/card-model';

export interface DeleteCardById {
  deleteById(_id: string, userId: string): Promise<CardModel>;
}
