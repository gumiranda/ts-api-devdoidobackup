import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import repository from '../repositories/user-repository';
import validation from '../../../bin/helpers/validators/validationContract';
import ctrlBase from '../../../bin/base/controller-base';
import variables from '../../../bin/configuration/variables';
import OneSignal from '../../../bin/handlers/onesignal';

const _repo = new repository();

export default class UserController {
  async post(req, res) {
    const validationContract = new validation();
    validationContract.isRequired(req.body.name, 'Informe seu name pentelho');
    validationContract.isRequired(req.body.email, 'Informe seu email pentelho');
    validationContract.isRequired(
      req.body.password,
      'Informe sua password pentelho',
    );
    validationContract.isRequired(
      req.body.passwordConfirmation,
      'Informe sua password confirmação pentelho',
    );
    validationContract.isTrue(
      req.body.passwordConfirmation !== req.body.password,
      'As passwords devem ser iguais pentelho',
    );
    validationContract.isEmail(
      req.body.email,
      'Informe um email válido pentelho',
    );

    try {
      const userExists: any = await _repo.emailExists(req.body.email);
      if (userExists) {
        validationContract.isTrue(
          userExists.name != undefined,
          `Já existe o email ${req.body.email} cadastrado no banco de dados`,
        );
      }
      const salt = await bcrypt.genSaltSync(10);
      delete req.body.passwordConfirmation;
      req.body.password = await bcrypt.hashSync(req.body.password, salt);
      if (req.body.pushToken) {
        await OneSignal.addDevice(req.body.pushToken);
      }
      const { name, password, email } = req.body;
      const modelData: any = { name, password, email };
      ctrlBase.post(_repo, validationContract, res, modelData);
    } catch (e) {
      res.status(500).send({ message: 'Internal server error', error: e });
    }
  }
  async put(req, res) {
    const validationContract = new validation();
    validationContract.isRequired(req.body.name, 'Informe seu name pentelho');
    validationContract.isRequired(req.params.id, 'Informe seu id pentelho');
    validationContract.isRequired(req.body.email, 'Informe seu email pentelho');
    validationContract.isRequired(
      req.body.password,
      'Informe sua password pentelho',
    );
    validationContract.isRequired(
      req.body.passwordConfirmation,
      'Informe sua password confirmação pentelho',
    );
    +validationContract.isTrue(
      req.body.passwordConfirmation !== req.body.password,
      'As passwords devem ser iguais pentelho',
    );
    validationContract.isEmail(
      req.body.email,
      'Informe um email válido pentelho',
    );

    try {
      const userExists: any = await _repo.emailExists(req.body.email);
      if (userExists) {
        validationContract.isTrue(
          userExists.name != undefined && userExists._id != req.params.id,
          `Já existe o email ${req.body.email} cadastrado no banco de dados`,
        );
      }
      if (req.usuarioLogado.user._id.toString() === req.params.id) {
        ctrlBase.put(_repo, validationContract, req, res);
      } else {
        res.status(401).send({ message: 'Você não tem permissão' });
      }
    } catch (e) {
      res.status(500).send({ message: 'Internal server error', error: e });
    }
  }
  async completeRegister(req, res) {
    try {
      const validationContract = new validation();
      validationContract.isRequired(req.body.cpf, 'Informe seu cpf pentelho');
      validationContract.isRequired(
        req.body.phone,
        'Informe seu phone pentelho',
      );
      if (!validationContract.isValid()) {
        req
          .status(400)
          .send({
            message: 'Existem dados inválido na sua requisição',
            validation: validationContract.errors(),
          })
          .end();
        return;
      }
      const data = req.body;
      const user = await _repo.completeRegister(
        data,
        req.usuarioLogado.user._id,
      );
      res.status(200).send(user);
    } catch (e) {
      res.status(500).send({ message: 'Internal server error', error: e });
    }
  }
  async get(req, res) {
    ctrlBase.get(_repo, req, res);
  }
  async delete(req, res) {
    const validationContract = new validation();
    validationContract.isRequired(req.params.id, 'Informe seu id pentelho');
    ctrlBase.remove(_repo, req, res);
  }
  async getByPage(req, res) {
    const validationContract = new validation();
    const { params } = req;
    const { page } = params;
    validationContract.isRequired(page, 'pageNumber obrigatório');
    try {
      const resultado = await _repo.getByPage(page, req.usuarioLogado.user._id);
      res.status(200).send(resultado);
    } catch (erro) {
      res.status(500).send({ message: 'Erro no processamento', error: erro });
    }
  }
  async authenticate(req, res) {
    const validationContract = new validation();
    validationContract.isRequired(req.body.email, 'Informe seu email pentelho');
    validationContract.isRequired(
      req.body.password,
      'Informe sua password pentelho',
    );
    validationContract.isRequired(
      req.body.passwordConfirmation,
      'Informe sua password confirmação pentelho',
    );
    validationContract.isTrue(
      req.body.passwordConfirmation !== req.body.password,
      'As passwords devem ser iguais pentelho',
    );
    validationContract.isEmail(
      req.body.email,
      'Informe um email válido pentelho',
    );
    if (!validationContract.isValid()) {
      res.status(400).send({
        message: 'Não foi possível efetuar o login',
        validation: validationContract.errors(),
      });
      return;
    }
    const usuarioEncontrado = await _repo.authenticate(
      req.body.email,
      req.body.password,
    );
    if (usuarioEncontrado == null) {
      res
        .status(404)
        .send({ message: 'Usuario ou password informados são inválidos' });
    }
    if (usuarioEncontrado) {
      res.status(200).send({
        usuario: usuarioEncontrado,
        token: jwt.sign(
          { user: usuarioEncontrado },
          variables.Security.secretKey,
        ),
      });
    } else {
      res
        .status(404)
        .send({ message: 'Usuario ou password informados são inválidos' });
    }
  }
}
