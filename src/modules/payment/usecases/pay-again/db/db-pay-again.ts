import { PayAgain } from '../pay-again';
import { TransactionModel } from '@/modules/payment/models/transaction-model';
import pagarme from '@/bin/helpers/external-apis/pagarme';
import { AddTransactionRepository } from '../../../repositories/transaction/protocols/add-transaction-repository';
import { LoadCardByIdRepository } from '@/modules/payment/repositories/card/protocols/load-card-by-id-repository';
import { UpdatePayDay } from '../../update-pay-day/update-pay-day';
import { LoadCardByPageRepository } from '@/modules/payment/repositories/card/protocols/load-card-by-page-repository';

export class DbPayAgain implements PayAgain {
  constructor(
    private readonly addTransactionRepository: AddTransactionRepository,
    private readonly loadCardByIdRepository: LoadCardByIdRepository,
    private readonly loadCardByPageRepository: LoadCardByPageRepository,
    private readonly updatePayDay: UpdatePayDay,
  ) {}
  private async payPagarme(card, userId) {
    const transactionCreated = await pagarme.createTransactionByCardId(card);
    if (transactionCreated?.authorization_code) {
      const {
        status,
        authorization_code,
        risk_level,
        acquirer_id,
      } = transactionCreated;
      const transaction = {
        status,
        authorization_code,
        risk_level,
        cardId: card._id,
        userId,
        acquirer_id,
        active: true,
        createdAt: new Date(),
      };
      const transactionAdded = await this.addTransactionRepository.add(
        transaction,
      );

      if (transactionAdded) {
        const userUpdated = await this.updatePayDay.updatePayDay(userId, 30);
        if (userUpdated) {
          return transactionAdded;
        }
      }
    }
    return null;
  }
  async payEasy(userId: string): Promise<TransactionModel> {
    const cards = await this.loadCardByPageRepository.loadByPage(1, userId);
    if (cards && cards.length > 0) {
      for (const card of cards) {
        const transactionSuccessful = await this.payPagarme(card, userId);
        if (transactionSuccessful) {
          return transactionSuccessful;
        }
      }
    }
    return null;
  }
  async payAgain(
    cardId: string,
    value: Number,
    userId: string,
  ): Promise<TransactionModel> {
    let card: any = await this.loadCardByIdRepository.loadById(cardId);
    if (!card) {
      return null;
    }
    if (value) {
      card.value = value;
    }
    const transactionSuccessful = await this.payPagarme(card, userId);
    if (transactionSuccessful) {
      return transactionSuccessful;
    }
    return null;
  }
}
