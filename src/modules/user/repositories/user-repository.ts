import '../models/user-model';
import bcrypt from 'bcryptjs';
import base from '@/bin/base/repository-base';

export default class userRepository {
  private readonly _base: base;
  private readonly _projection: string;
  constructor() {
    this._base = new base('User');
    this._projection = 'name email payDay type cpf phone pushId';
  }

  async authenticate(email, password) {
    const user: any = await this._base._model.findOne({ email });
    const userR = await this._base._model.findOne({ email }, this._projection);
    if (await bcrypt.compareSync(password, user.password)) {
      return userR;
    }
    return null;
  }

  emailExists(Email) {
    return this._base._model.findOne({ email: Email }, this._projection);
  }

  create(modelData: any) {
    return this._base.create(modelData);
  }

  updatePayment(data, userid) {
    return this._base.update(userid, { payDay: data });
  }

  async completeRegister(data, userid) {
    await this._base.update(userid, data);
    const userR = await this._base._model.findOne(
      { _id: userid },
      this._projection,
    );
    return userR;
  }

  async update(id, data, usuarioLogado) {
    if (usuarioLogado._id === id) {
      if (
        data.oldPassword !== data.password &&
        data.oldPassword &&
        data.password !== undefined &&
        data.passwordConfirmation !== undefined &&
        data.password === data.passwordConfirmation
      ) {
        const user: any = await this._base._model.findOne({ _id: id });
        if (await bcrypt.compareSync(data.oldPassword, user.password)) {
          const salt = await bcrypt.genSaltSync(10);
          const _hashpassword = await bcrypt.hashSync(data.password, salt);
          let { name } = user;
          let { email } = user;
          if (data.email) {
            email = data.email;
          }
          if (data.name) {
            name = data.name;
          }
          const usuarioAtualizado = await this._base.update(id, {
            name,
            email,
            password: _hashpassword,
          });
          return this._base._model.findById(
            usuarioAtualizado._id,
            this._projection,
          );
        }
        return { message: 'password inválida' };
      }
    } else {
      return { message: 'Você não tem permissão para editar esse usuário' };
    }
  }

  getAll() {
    return this._base._model.find({}, this._projection);
  }

  getPushId(_id) {
    return this._base._model.findOne({ _id }, 'pushId name');
  }

  async getByPage(page, user) {
    const users = await this._base._model
      .find({ type: 'client', _id: { $ne: user } }, this._projection)
      .skip((page - 1) * 10)
      .limit(10)
      .sort({ createdAt: -1 });
    const usersCount = await this._base._model
      .find({ type: 'client', _id: { $ne: user } }, this._projection)
      .count();
    return {
      users,
      usersCount,
    };
  }

  delete(id) {
    return this._base.delete(id);
  }
}
