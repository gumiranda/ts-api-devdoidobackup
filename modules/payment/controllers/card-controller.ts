import repository from '../repositories/card-repository';
import ctrlBase from '../../../bin/base/controller-base';
const _repo = new repository();
export default class CardController {
  async get(req, res) {
    try {
      const { usuarioLogado } = req;
      const { user } = usuarioLogado;
      const { _id } = user;
      const cards = await _repo.getMyAll(_id);
      res.status(200).send(cards);
    } catch (e) {
      res.status(500).send({ message: 'Internal server error', error: e });
    }
  }
  async remove(req, res) {
    ctrlBase.remove(_repo, req, res);
  }
}
