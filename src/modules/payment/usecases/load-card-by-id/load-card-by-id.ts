import { CardModel } from '../../models/card-model';

export interface LoadCardById {
  loadById(_id: string): Promise<CardModel>;
}
