import {
  RequestData,
  RequestModel,
} from '@/modules/request/models/request-model';
import { UpdateRequestRepository } from '@/modules/request/repositories/protocols/update-request-repository';
import { UpdateUserRepository } from '@/modules/user/repositories/protocols/update-user-repository';
import { ObjectId } from 'mongodb';
import { UpdateRequest } from '../update-request';

export class DbUpdateRequest implements UpdateRequest {
  constructor(
    private readonly updateRequestRepository: UpdateRequestRepository,
    private readonly updateUserRepository: UpdateUserRepository,
  ) {}
  async updateRequest(
    data: RequestData,
    requestId: string,
  ): Promise<RequestModel> {
    const requestResult = await this.updateRequestRepository.updateOne(
      data,
      requestId,
    );
    if (requestResult && requestResult?.userFor) {
      console.log('id', requestResult.userFor.toString());
      const userBy = requestResult?.userBy.toString();
      console.log('userby', userBy);

      const professionalAdded = await this.updateUserRepository.updateOne(
        { ownerId: new ObjectId(requestResult.userFor.toString()) },
        userBy,
      );
      if (professionalAdded) {
        return requestResult;
      }
    }
    return null;
  }
}
