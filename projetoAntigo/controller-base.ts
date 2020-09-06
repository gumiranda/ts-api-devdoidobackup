const post = async (repository, validationContract, res, modelData) => {
  try {
    if (!validationContract.isValid()) {
      res
        .status(400)
        .send({
          message: 'Existem dados inválidos na sua requisição',
          validation: validationContract.errors(),
        })
        .end();
      return;
    }
    const resultado = await repository.create(modelData);
    res.status(201).send(resultado);
  } catch (e) {
    res.status(500).send({ message: 'Internal server error', error: e });
  }
};

const put = async (repository, validationContract, req, res) => {
  try {
    const data = req.body;
    if (!validationContract.isValid()) {
      res
        .status(400)
        .send({
          message: 'Existem dados inválidos na sua requisição',
          validation: validationContract.errors(),
        })
        .end();
      return;
    }
    const resultado = await repository.update(
      req.params.id,
      data,
      req.usuarioLogado.user,
    );
    res.status(202).send(resultado);
  } catch (e) {
    res.status(500).send({ message: 'Internal server error', error: e });
  }
};
const get = async (repository, req, res) => {
  try {
    const resultado = await repository.getAll();
    res.status(200).send(resultado);
  } catch (erro) {
    res.status(500).send({ message: 'Erro no processamento', error: erro });
  }
};
const getById = async (repository, req, res) => {
  try {
    const resultado = await repository.getById(req.params.id);
    res.status(200).send(resultado);
  } catch (erro) {
    res.status(500).send({ message: 'Erro no processamento', error: erro });
  }
};
const getMyAll = async (repository, req, res) => {
  try {
    const resultado = await repository.getMyAll(req.usuarioLogado.user);
    res.status(200).send(resultado);
  } catch (erro) {
    res.status(500).send({ message: 'Erro no processamento', error: erro });
  }
};
const getMy = async (repository, validationContract, req, res) => {
  try {
    if (!validationContract.isValid()) {
      res
        .status(400)
        .send({
          message: 'Existem dados inválidos na sua requisição',
          validation: validationContract.errors(),
        })
        .end();
      return;
    }
    const resultado = await repository.getMy(
      req.params.page,
      req.usuarioLogado.user,
    );
    res.status(200).send(resultado);
  } catch (erro) {
    res.status(500).send({ message: 'Erro no processamento', error: erro });
  }
};
const remove = async (repository, req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const resultado = await repository.delete(id, req.usuarioLogado);
      if (resultado !== 'Operação Inválida') {
        res.status(200).send({ message: 'Registro excluído com sucesso' });
      } else {
        res.status(401).send({ message: 'Operação inválida' });
      }
    } else {
      res.status(500).send({ message: 'O parametro id precisa ser informado' });
    }
  } catch (e) {
    res.status(500).send({ message: 'Internal server error', error: e });
  }
};
export default {
  post,
  put,
  remove,
  getById,
  get,
  getMy,
  getMyAll,
};
