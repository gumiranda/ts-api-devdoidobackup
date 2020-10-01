import { Controller } from '@/bin/protocols/controller';
import { AddUser } from '@/modules/user/usecases/add-user/add-user';
import { HttpResponse, HttpRequest } from '@/bin/protocols/http';
import {
  badRequest,
  serverError,
  forbidden,
  createdOk,
} from '@/bin/helpers/http-helper';
import { Validation } from '@/bin/helpers/validators/validation';
import { EmailInUseError } from '@/bin/errors';
import OneSignal from '@/bin/helpers/external-apis/onesignal';
import { addDay } from '@/bin/utils/date-fns';
import { ObjectId } from 'mongodb';
export class AddProfessionalController implements Controller {
  private readonly addUser: AddUser;
  private readonly validation: Validation;

  constructor(addUser: AddUser, validation: Validation) {
    this.validation = validation;
    this.addUser = addUser;
  }

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const errors = this.validation.validate(httpRequest.body);
      if (errors?.length > 0) {
        return badRequest(errors);
      }
      if (!httpRequest.body.role || httpRequest.body?.role === 'admin') {
        httpRequest.body.role = 'professional';
      }
      const {
        name,
        email,
        password,
        role,
        coord,
        pushToken,
        pushId,
        services,
      } = httpRequest.body;
      const { userId } = httpRequest;
      const payDay = addDay(new Date(), 7);
      let position = coord;
      let obj: any = {
        name,
        email,
        password,
        role,
        pushId,
        payDay,
        ownerId: new ObjectId(userId),
        active: role === 'professional' ? true : false,
        face: false,
        coord: { type: 'Point', coordinates: position },
        services,
        createdAt: new Date(),
      };
      obj.services = obj.services.map((serviceId) => new ObjectId(serviceId));
      const user = await this.addUser.add(obj);
      if (!user) {
        return forbidden(new EmailInUseError());
      }
      if (pushToken) {
        await OneSignal.addDevice(pushToken);
      }
      return createdOk(user);
    } catch (error) {
      return serverError(error);
    }
  }
}
