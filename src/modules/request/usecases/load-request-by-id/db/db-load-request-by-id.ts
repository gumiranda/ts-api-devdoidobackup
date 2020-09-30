import { RequestModel } from '@/modules/request/models/request-model';
import { LoadRequestByIdRepository } from '@/modules/request/repositories/protocols/load-request-by-id-repository';
import { LoadRequestById } from '../load-request-by-id';

export class DbLoadRequestById implements LoadRequestById {
  constructor(
    private readonly loadRequestByIdRepository: LoadRequestByIdRepository,
  ) {}
  async loadById(request_id: string): Promise<RequestModel> {
    if (request_id) {
      const request = await this.loadRequestByIdRepository.loadById(request_id);
      if (request) {
        return request;
      }
    }
    return null;
  }
}
