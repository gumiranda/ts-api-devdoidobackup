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
import { InvalidParamError } from '../../../../bin/errors/invalid-param-error';
import { TransactionModelRequest } from '../../models/transaction-model';
import { PayOnce } from '../../usecases/pay-once/pay-once';
import { PayAgain } from '../../usecases/pay-again/pay-again';
export class TransactionController implements Controller {
  constructor(
    private readonly payOnce: PayOnce,
    private readonly payAgain: PayAgain,
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
        transactionAdded = await this.payAgain.payAgain(
          card_id,
          Number(value),
          userId,
        );
        if (!transactionAdded) {
          return forbidden(new InvalidParamError('card_id'));
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
