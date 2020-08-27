import '../models/notification-model';
import base from '../../../bin/base/repository-base';
import { AddNotificationModel } from '../models/AddNotificationModel';
export default class notificationRepository {
  public _base: base;
  constructor() {
    this._base = new base('Notification');
  }

  create(modelData: AddNotificationModel) {
    return this._base.create(modelData);
  }

  update(id, data) {
    return this._base.update(id, data);
  }

  getAll() {
    return this._base.getAll();
  }

  getById(id) {
    return this._base.getById(id);
  }

  delete(id) {
    return this._base.delete(id);
  }

  async getMy(page, user) {
    const notifications = await this._base._model
      .find({ ativo: { $ne: false }, userFor: user._id })
      .skip((page - 1) * 10)
      .limit(10)
      .sort({ dataCriacao: -1 });
    const notificationsCount = await this._base._model
      .find({ ativo: { $ne: false }, userFor: user._id })
      .count();
    return {
      notifications,
      notificationsCount,
    };
  }
}

module.exports = notificationRepository;
