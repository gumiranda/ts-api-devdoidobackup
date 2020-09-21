import { CardModel } from '@/modules/payment/models/card-model';
import { AddCardRepository } from '@/modules/payment/repositories/card/protocols/add-card-repository';
import { AddCard, AddCardModel } from '../add-card';

export class DbAddCard implements AddCard {
  private readonly addCardRepository: AddCardRepository;

  constructor(addCardRepository: AddCardRepository) {
    this.addCardRepository = addCardRepository;
  }

  async add(cardData: AddCardModel): Promise<CardModel> {
    const card = await this.addCardRepository.add(cardData);
    return card;
  }
}
