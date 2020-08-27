import '../models/card-model';
import base from '../../../bin/base/repository-base';

export default class cardRepository {
  private readonly _base: base;
  private readonly _projection: string;
  constructor() {
    this._base = new base('Card');
    this._projection = 'name cardNumber brand';
  }

  getMyAll(userId) {
    return this._base._model.find({ userId }, this._projection);
  }

  getById(id) {
    return this._base.getById(id);
  }

  async delete(id, user) {
    const model: any = await this._base.getById(id);
    if (model.userId.toString() === user._id) {
      return await this._base.delete(id);
    }
    return 'Operação Inválida';
  }

  async create(data) {
    const card = await this._base.create(data);
    return card;
  }
}
module.exports = cardRepository;
