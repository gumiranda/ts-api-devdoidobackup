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
import { AccessDeniedError } from '@/bin/errors';
import { AddTransaction } from '../../usecases/add-transaction/add-transaction';
import pagarme from '@/bin/helpers/external-apis/pagarme';
import { LoadCardById } from '../../usecases/load-card-by-id/load-card-by-id';
import { InvalidParamError } from '../../../../bin/errors/invalid-param-error';
import { TransactionModelRequest } from '../../models/transaction-model';
import { PayOnce } from '../../usecases/pay-once/pay-once';
export class TransactionController implements Controller {
  constructor(
    private readonly addTransaction: AddTransaction,
    private readonly payOnce: PayOnce,
    private readonly loadCard: LoadCardById,
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
      transactionAdded = await this.payOnce.payOnce(obj, userId);
      if (transactionAdded) {
        return ok(transactionAdded);
      }
      return forbidden(new AccessDeniedError());
    } catch (error) {
      return serverError(error);
    }
  }
}
