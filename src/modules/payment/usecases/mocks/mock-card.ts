import { CardModel, CardsPaginate } from '../../models/card-model';
import { mockFakeCard, makeFakeArrayCards } from '../../models/mocks/mock-card';
import { AddCard, AddCardModel } from '../add-card/add-card';
import { DeleteCardById } from '../delete-card-by-id/delete-card-by-id';
import { LoadCardById } from '../load-card-by-id/load-card-by-id';
import { LoadCardByPage } from '../load-card-by-page/load-card-by-page';

export const mockAddCard = (): AddCard => {
  class AddCardStub implements AddCard {
    cardModel = mockFakeCard();
    async add(card: AddCardModel): Promise<CardModel> {
      return new Promise((resolve) => resolve(this.cardModel));
    }
  }
  return new AddCardStub();
};
export const mockLoadCardByPage = (): LoadCardByPage => {
  class LoadCardByPageStub implements LoadCardByPage {
    cards = makeFakeArrayCards();
    page: number;
    cardId: string;
    loadByPage(page: number, cardId: string): Promise<CardsPaginate> {
      this.page = page;
      this.cardId = cardId;
      return new Promise((resolve) =>
        resolve({
          cards: this.cards.slice(0, 10),
          cardsCount: this.cards.length,
        }),
      );
    }
  }
  return new LoadCardByPageStub();
};
export const mockLoadCardById = (): LoadCardById => {
  class LoadCardByIdStub implements LoadCardById {
    cardModel = mockFakeCard();
    _id: string;
    async loadById(_id: string): Promise<CardModel> {
      this._id = _id;
      return new Promise((resolve) => resolve(this.cardModel));
    }
  }
  return new LoadCardByIdStub();
};
export const mockDeleteCardById = (): DeleteCardById => {
  class DeleteCardByIdStub implements DeleteCardById {
    cardModel = mockFakeCard();
    _id: string;
    async deleteById(_id: string): Promise<CardModel> {
      this._id = _id;
      return new Promise((resolve) => resolve(this.cardModel));
    }
  }
  return new DeleteCardByIdStub();
};
