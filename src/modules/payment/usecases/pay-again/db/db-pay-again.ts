import { PayAgain } from '../pay-again';
import { TransactionModel } from '@/modules/payment/models/transaction-model';
import pagarme from '@/bin/helpers/external-apis/pagarme';
import { addDay } from '@/bin/utils/date-fns';
import { AddTransactionRepository } from '../../../repositories/transaction/protocols/add-transaction-repository';
import { UpdateUserRepository } from '../../../../user/repositories/protocols/update-user-repository';
import { LoadUserByIdRepository } from '@/modules/user/repositories/protocols/load-user-by-id-repository';
import { LoadCardByIdRepository } from '@/modules/payment/repositories/card/protocols/load-card-by-id-repository';

export class DbPayAgain implements PayAgain {
  constructor(
    private readonly addTransactionRepository: AddTransactionRepository,
    private readonly loadCardByIdRepository: LoadCardByIdRepository,
    private readonly updateUserRepository: UpdateUserRepository,
    private readonly loadUserByIdRepository: LoadUserByIdRepository,
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
        const user = await this.loadUserByIdRepository.loadById(userId);
        if (user) {
          const payDay = addDay(new Date(user.payDay), 30);
          const userUpdated = await this.updateUserRepository.updateOne(
            { payDay },
            userId,
          );
          if (userUpdated) {
            return transactionAdded;
          }
        }
      }
    }
    return null;
  }
}
