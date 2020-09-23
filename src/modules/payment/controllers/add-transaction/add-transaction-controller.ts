import { LoadUserById } from './../../../user/usecases/load-user-by-id/load-user-by-id';
import { Controller } from '@/bin/protocols/controller';
import { HttpResponse, HttpRequest } from '@/bin/protocols/http';
import {
  badRequest,
  serverError,
  ok,
  forbidden,
} from '@/bin/helpers/http-helper';
import CryptoJSHelper from '@/bin/helpers/crypto-js';
import { Validation } from '@/bin/helpers/validators/validation';
import { AccessDeniedError, EmailInUseError } from '@/bin/errors';
import { addDay } from '@/bin/utils/date-fns';
import { AddTransaction } from '../../usecases/add-transaction/add-transaction';
import { AddCard } from '../../usecases/add-card/add-card';
import { UpdateUser } from '@/modules/user/usecases/update-user/update-user';
import pagarme from '@/bin/helpers/external-apis/pagarme';
import { LoadCardById } from '../../usecases/load-card-by-id/load-card-by-id';
import { InvalidParamError } from '../../../../bin/errors/invalid-param-error';
import { TransactionModelRequest } from '../../models/transaction-model';
export class TransactionController implements Controller {
  constructor(
    private readonly addTransaction: AddTransaction,
    private readonly addCard: AddCard,
    private readonly loadCard: LoadCardById,
    private readonly updateUser: UpdateUser,
    private readonly loadUser: LoadUserById,
    private readonly validation: Validation,
  ) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errors = this.validation.validate(httpRequest.body);
      if (errors?.length > 0) {
        return badRequest(errors);
      }
      const { userId } = httpRequest;
      const {
        card_id,
        card_hash,
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
      } = httpRequest.body;
      let transactionAdded;

      if (card_id) {
        let card: any = await this.loadCard.loadById(card_id);
        if (!card) {
          return forbidden(new InvalidParamError('card_id'));
        }
        if (value) {
          card.value = value;
        }
        const transactionCreated = await pagarme.createTransactionByCardId(
          card,
        );
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
          transactionAdded = await this.addTransaction.add(transaction);
        } else {
          return serverError(transactionCreated);
        }
      }
      const cardHash = await CryptoJSHelper.generateCardHashPagarme(card_hash);
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
      return forbidden(new AccessDeniedError());
    } catch (error) {
      return serverError(error);
    }
  }
}
