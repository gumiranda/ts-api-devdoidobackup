import mongoose from 'mongoose';
export default class baseRepository {
  public _model: any;

  constructor(model) {
    this._model = mongoose.model(model);
  }
  async create(data) {
    const modelo = new this._model(data);
    const { _doc: resultado } = await modelo.save();
    if (resultado.password) {
      const { password, createdAt, ...collectionWithoutPassword } = resultado;
      return collectionWithoutPassword;
    }
    return resultado;
  }

  async update(id, data) {
    await this._model.findByIdAndUpdate(id, { $set: data });
    const resultado = await this._model.findById(id);
    return resultado;
  }

  async getAll() {
    return await this._model.find({});
  }

  async getMyAll(user) {
    return await this._model.find({ userId: user._id });
  }

  async delete(id) {
    return await this._model.findByIdAndDelete(id);
  }

  async getById(id) {
    return await this._model.findById(id);
  }
}
