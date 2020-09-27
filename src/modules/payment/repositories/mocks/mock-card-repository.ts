import { CardModel } from '../../models/card-model';
import {
  mockFakeCard,
  makeFakeArrayCards,
  mockValidCardData,
} from '../../models/mocks/mock-card';
import { AddCardRepository } from '../card/protocols/add-card-repository';
import { DeleteCardByIdRepository } from '../card/protocols/delete-card-by-id-repository';
import { LoadCardByIdRepository } from '../card/protocols/load-card-by-id-repository';
import { LoadCardByPageRepository } from '../card/protocols/load-card-by-page-repository';

export const mockAddCardRepository = (): AddCardRepository => {
  class AddCardRepositoryStub implements AddCardRepository {
    cardModel = mockFakeCard();
    async add(cardData: Omit<CardModel, '_id'>): Promise<CardModel> {
      return new Promise((resolve) => resolve(this.cardModel));
    }
  }
  return new AddCardRepositoryStub();
};

export const mockLoadCardByIdRepository = (): LoadCardByIdRepository => {
  class LoadCardByIdStub implements LoadCardByIdRepository {
    card_id: string;
    _id: string;
    cardModel = mockValidCardData();
    async loadById(card_id: string): Promise<CardModel> {
      this.card_id = card_id;
      if (this.cardModel !== null) {
        this.cardModel.card_id = card_id;
      }
      return new Promise((resolve) => resolve(this.cardModel));
    }
  }
  return new LoadCardByIdStub();
};
export const mockDeleteCardByIdRepository = (): DeleteCardByIdRepository => {
  class DeleteCardByIdStub implements DeleteCardByIdRepository {
    _id: string;
    cardModel = mockValidCardData();
    async deleteById(_id: string): Promise<CardModel> {
      this._id = _id;
      if (this.cardModel !== null) {
        this.cardModel._id = _id;
      }
      return new Promise((resolve) => resolve(this.cardModel));
    }
  }
  return new DeleteCardByIdStub();
};
export const mockLoadCardByPageRepository = (): LoadCardByPageRepository => {
  class LoadCardByPageStub implements LoadCardByPageRepository {
    cards = makeFakeArrayCards();
    page: number;
    cardId: string;
    async loadByPage(page: number, cardId: string): Promise<CardModel[]> {
      this.cardId = cardId;
      this.page = page;
      return new Promise((resolve) => resolve(this.cards?.slice(0, 10)));
    }
    async countCardsByPage(cardId: string): Promise<number> {
      this.cardId = cardId;
      return new Promise((resolve) => resolve(this.cards?.length));
    }
  }
  return new LoadCardByPageStub();
};
