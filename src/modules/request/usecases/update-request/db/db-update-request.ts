import {
  RequestData,
  RequestModel,
} from '@/modules/request/models/request-model';
import { UpdateRequestRepository } from '@/modules/request/repositories/protocols/update-request-repository';
import { UpdateRequest } from '../update-request';

export class DbUpdateRequest implements UpdateRequest {
  constructor(
    private readonly updateRequestRepository: UpdateRequestRepository,
  ) {}
  async updateRequest(
    data: RequestData,
    requestId: string,
  ): Promise<RequestModel> {
    const requestResult = await this.updateRequestRepository.updateOne(
      data,
      requestId,
    );
    return requestResult;
  }
}
