import { PayAgain } from '../pay-again';
import { TransactionModel } from '@/modules/payment/models/transaction-model';
import pagarme from '@/bin/helpers/external-apis/pagarme';
import { AddTransactionRepository } from '../../../repositories/transaction/protocols/add-transaction-repository';
import { LoadCardByIdRepository } from '@/modules/payment/repositories/card/protocols/load-card-by-id-repository';
import { UpdatePayDay } from '../../update-pay-day/update-pay-day';

export class DbPayAgain implements PayAgain {
  constructor(
    private readonly addTransactionRepository: AddTransactionRepository,
    private readonly loadCardByIdRepository: LoadCardByIdRepository,
    private readonly updatePayDay: UpdatePayDay,
  ) {}
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
    console.log(card);
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
}
