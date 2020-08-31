import '../models/notification-model';
import OneSignal from '@/bin/handlers/onesignal';
import repository from '../repositories/notification-repository';
import repositoryUser from '../../user/repositories/user-repository';

const _repo = new repository();
const _repoUser = new repositoryUser();

import ctrlBase from '@/bin/base/controller-base';
import validation from '@/bin/helpers/validators/validationContract';
import { AddNotificationModel } from '../models/AddNotificationModel';
export default class NotificationController {
  async post(req, res) {
    const _validationContract = new validation();
    _validationContract.isRequired(
      req.body.content,
      'O conteúdo da notification é obrigatório',
    );
    _validationContract.isRequired(
      req.body.userFor,
      'O userFor notification é obrigatório',
    );
    if (!_validationContract.isValid()) {
      res
        .status(400)
        .send({
          message: 'Existem dados inválidos na sua requisição',
          validation: _validationContract.errors(),
        })
        .end();
      return;
    }
    try {
      const pushIdUserFor = await _repoUser.getPushId(req.body.userFor);
      if (pushIdUserFor === null) {
        res
          .status(400)
          .send({
            message: 'Existem dados inválidos na sua requisição',
          })
          .end();
        return;
      }
      await OneSignal.sendNotification(
        pushIdUserFor.pushId,
        req.usuarioLogado.user.name,
        req.body.content,
      );
      req.body.userBy = req.usuarioLogado.user._id;
      const modelData: AddNotificationModel = req.body;
      ctrlBase.post(_repo, _validationContract, res, modelData);
    } catch (erro) {
      res.status(500).send({ message: 'Erro no processamento', error: erro });
    }
  }
  async getMy(req, res) {
    const _validationContract = new validation();
    _validationContract.isRequired(req.params.page, 'pageNumber obrigatório');
    ctrlBase.getMy(_repo, _validationContract, req, res);
  }
  async put(req, res) {
    const _validationContract = new validation();
    _validationContract.isRequired(req.params.id, 'id obrigatório');
    ctrlBase.put(_repo, _validationContract, req, res);
  }
  async get(req, res) {
    ctrlBase.get(_repo, req, res);
  }
  async getById(req, res) {
    ctrlBase.getById(_repo, req, res);
  }
  async remove(req, res) {
    ctrlBase.remove(_repo, req, res);
  }
}
