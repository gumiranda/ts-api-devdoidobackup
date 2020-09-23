import { TransactionMongoRepository } from '../../../repositories/transaction/transaction-mongo-repository';
import { PayOnce } from '../pay-once';
import {
  TransactionModelRequest,
  TransactionModel,
} from '@/modules/payment/models/transaction-model';
import { CardMongoRepository } from '@/modules/payment/repositories/card/card-mongo-repository';
import pagarme from '@/bin/helpers/external-apis/pagarme';
import { UserMongoRepository } from '@/modules/user/repositories/user-mongo-repository';
import { addDay } from '@/bin/utils/date-fns';

export class DbPayOnce implements PayOnce {
  constructor(
    private readonly transactionRepository: TransactionMongoRepository,
    private readonly cardRepository: CardMongoRepository,
    private readonly userRepository: UserMongoRepository,
  ) {}
  async payOnce(
    transaction: TransactionModelRequest,
    userId: string,
  ): Promise<TransactionModel> {
    const transactionCreated = await pagarme.createNewTransaction(transaction);
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
      const cardCreated = await this.cardRepository.add(cardToAdd);
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
      const transactionAdded = await this.transactionRepository.add(
        transaction,
      );
      if (transactionAdded) {
        const user = await this.userRepository.loadById(userId);
        const payDay = addDay(new Date(user.payDay), 30);
        await this.userRepository.updateOne({ payDay }, userId);
        return transactionAdded;
      }
    }
    return null;
  }
}

/*
let obj: TransactionModelRequest = {
        cardHash,
        name,
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
        createdAt: new Date(),
      };
      const transactionCreated = await pagarme.createNewTransaction(obj);
      if (!transactionCreated.card) {
        if (transactionCreated.length > 0) {
          let errorsPagarme = [];
          for (const errorPagarme of transactionCreated) {
            errorsPagarme.push(badRequest(errorPagarme.message));
          }
          return badRequest(errorsPagarme);
        }
        return serverError(transactionCreated);
      }
      const {
        holder_name,
        id,
        brand,
        first_digits,
        last_digits,
      } = transactionCreated.card;
      const card = {
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

      const cardCreated = await this.addCard.add(card);
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
        cardId: cardCreated._id,
        userId,
        createdAt: new Date(),
        active: true,
        acquirer_id,
      };
      transactionAdded = await this.addTransaction.add(transaction);
      if (transactionAdded) {
        const user = await this.loadUser.loadById(userId);
        const payDay = addDay(new Date(user.payDay), 30);
        await this.updateUser.updateUser({ payDay }, userId);
        return ok(transactionAdded);
      }
*/
