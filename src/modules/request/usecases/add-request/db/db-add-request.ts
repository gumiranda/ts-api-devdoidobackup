import OneSignal from '@/bin/helpers/external-apis/onesignal';
import { RequestModel } from '@/modules/request/models/request-model';
import { AddRequestRepository } from '@/modules/request/repositories/protocols/add-request-repository';
import {
  AddRequest,
  AddRequestModel,
} from '@/modules/request/usecases/add-request/add-request';
import { LoadUserByIdRepository } from '@/modules/user/repositories/protocols/load-user-by-id-repository';
export class DbAddRequest implements AddRequest {
  constructor(
    private readonly addRequestRepository: AddRequestRepository,
    private readonly loadUserByIdRepository: LoadUserByIdRepository,
  ) {}
  async add(data: AddRequestModel): Promise<RequestModel> {
    const request = await this.addRequestRepository.add(data);
    const userFor = await this.loadUserByIdRepository.loadById(
      data.userFor.toString(),
    );
    const userBy = await this.loadUserByIdRepository.loadById(
      data.userBy.toString(),
    );
    if (userFor?.pushId && userBy?.name) {
      await OneSignal.sendNotification(
        userFor.pushId,
        userBy.name,
        data.content,
      );
    }
    if (request) {
      return request;
    }
    return null;
  }
}
