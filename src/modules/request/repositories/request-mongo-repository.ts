import { MongoRepository } from '@/bin/repository/mongo-repository';
import { ObjectId } from 'mongodb';
import { RequestData, RequestModel } from '../models/request-model';
import { AddRequestRepository } from './protocols/add-request-repository';
import { LoadRequestByIdRepository } from './protocols/load-request-by-id-repository';
import { LoadRequestByPageRepository } from './protocols/load-request-by-page-repository';
import { UpdateRequestRepository } from './protocols/update-request-repository';

export class RequestMongoRepository
  implements
    AddRequestRepository,
    LoadRequestByIdRepository,
    UpdateRequestRepository,
    LoadRequestByPageRepository {
  constructor(private readonly mongoRepository: MongoRepository) {}
  requestModel: RequestModel;
  request_id: string;
  requests;
  async add(requestData: Omit<RequestModel, '_id'>): Promise<RequestModel> {
    if (requestData?.type === 'approveProfessional') {
      const requestExists: any = await this.mongoRepository.getOne(
        {
          userFor: new ObjectId(requestData.userFor),
          userBy: new ObjectId(requestData.userBy),
        },
        {},
      );
      if (requestExists) {
        return null;
      }
    }

    const result = await this.mongoRepository.add(requestData);
    return result;
  }
  async updateOne(
    requestData: RequestData,
    requestId: string,
  ): Promise<RequestModel> {
    const { read } = requestData;
    if (!read) {
      return null;
    }
    await this.mongoRepository.updateOne(
      {
        _id: new ObjectId(requestId),
      },
      {
        $set: requestData,
      },
      { upsert: true },
    );
    const result: any = await this.mongoRepository.getOne(
      {
        _id: new ObjectId(requestId),
      },
      {},
    );
    return result;
  }
  async loadById(_id: string): Promise<RequestModel> {
    const request = await this.mongoRepository.getById(_id);
    return request;
  }
  countRequestsByPage(userFor: string): Promise<number> {
    return this.mongoRepository.getCount({ userFor });
  }
  loadByPage(page: number, userFor: string): Promise<RequestModel[]> {
    return this.mongoRepository.getPaginate(
      page,
      { userFor },
      { createdAt: -1 },
      10,
      {},
    );
  }
}
