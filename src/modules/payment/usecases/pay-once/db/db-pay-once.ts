import { PayOnce } from '../pay-once';
import {
  TransactionModelRequest,
  TransactionModel,
} from '@/modules/payment/models/transaction-model';
import pagarme from '@/bin/helpers/external-apis/pagarme';
import { addDay } from '@/bin/utils/date-fns';
import { AddTransactionRepository } from '../../../repositories/transaction/protocols/add-transaction-repository';
import { AddCardRepository } from '../../../repositories/card/protocols/add-card-repository';
import { UpdateUserRepository } from '../../../../user/repositories/protocols/update-user-repository';
import { LoadUserByIdRepository } from '@/modules/user/repositories/protocols/load-user-by-id-repository';

export class DbPayOnce implements PayOnce {
  constructor(
    private readonly addTransactionRepository: AddTransactionRepository,
    private readonly addCardRepository: AddCardRepository,
    private readonly updateUserRepository: UpdateUserRepository,
    private readonly loadUserByIdRepository: LoadUserByIdRepository,
  ) {}
  async payOnce(
    transaction: TransactionModelRequest,
    userId: string,
  ): Promise<TransactionModel> {
    const transactionCreated = await pagarme.createNewTransaction(transaction);
    console.warn(transactionCreated);
    const {
      email,
      phone,
      cpf,
      state,
      city,
      neighborhood,
      zipcode,
      value,
      street_number,
      street,
    } = transaction;
    if (
      transactionCreated?.card &&
      transactionCreated?.status &&
      transactionCreated?.authorization_code &&
      transactionCreated?.risk_level &&
      transactionCreated?.acquirer_id
    ) {
      const {
        status,
        authorization_code,
        risk_level,
        acquirer_id,
        card,
      } = transactionCreated;
      const { holder_name, id, brand, first_digits, last_digits } = card;

      const cardToAdd = {
        state,
        city,
        neighborhood,
        street,
        street_number,
        value,
        name: holder_name,
        cpf,
        phone,
        email,
        zipcode,
        card_id: id,
        userId,
        brand,
        holder_name,
        cardNumber: `${first_digits}******${last_digits}`,
        createdAt: new Date(),
        active: true,
      };
      const cardCreated = await this.addCardRepository.add(cardToAdd);
      const transaction = {
        status,
        authorization_code,
        risk_level,
        cardId: cardCreated._id,
        userId,
        createdAt: new Date(),
        active: true,
        acquirer_id,
      };
      const transactionAdded = await this.addTransactionRepository.add(
        transaction,
      );
      if (transactionAdded) {
        const user = await this.loadUserByIdRepository.loadById(userId);
        const payDay = addDay(new Date(user.payDay), 30);
        await this.updateUserRepository.updateOne({ payDay }, userId);
        return transactionAdded;
      }
    }
    return null;
  }
}
