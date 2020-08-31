import repository from '../repositories/transaction-repository';
import repositoryCard from '../repositories/card-repository';
import repositoryUser from '../../user/repositories/user-repository';
import ctrlBase from '@/bin/base/controller-base';
import validation from '@/bin/helpers/validators/validationContract';
import pagarme from 'pagarme';
import variables from '@/bin/configuration/variables';
import * as moment from 'moment';

const _repo = new repository();
const _repoCard = new repositoryCard();
const _repoUser = new repositoryUser();
export default class TransactionController {
  async post(req, res) {
    try {
      const validationContract = new validation();
      validationContract.isRequired(req.body.cpf, 'Informe seu cpf pentelho');
      const data = req.body;
      const encryption_key = variables.Pagarme.pagarmeKeyTest;
      const client = await pagarme.client.connect({ api_key: encryption_key });
      if (data.card_id) {
        const card: any = await _repoCard.getById(data.card_id);
        const pagarmeTransaction = await client.transactions.create({
          amount: 6000,
          payment_method: 'credit_card',
          card_id: card.card_id,
          customer: {
            name: card.name,
            external_id: '#3333',
            email: card.email,
            type: 'individual',
            country: 'br',
            phone_numbers: [`+${card.phone}`],
            documents: [{ type: 'cpf', number: card.cpf }],
          },
          billing: {
            name: card.name,
            address: {
              country: 'br',
              state: card.state,
              city: card.city,
              neighborhood: card.neighborhood,
              street: card.street,
              street_number: card.street_number,
              zipcode: card.zipcode,
            },
          },
          items: [
            {
              id: '1',
              title: 'Parcela mensal do aplicativo do dev doido',
              unit_price: data.value ? data.value : 30,
              quantity: 1,
              tangible: true,
            },
          ],
          metadata: { idProduto: '1' },
        });
        const transaction = {
          status: pagarmeTransaction.status,
          authorization_code: pagarmeTransaction.authorization_code,
          risk_level: pagarmeTransaction.risk_level,
          card: card._id,
          userId: req.usuarioLogado.user._id,
          acquirer_id: pagarmeTransaction.acquirer_id,
        };
        const transactionCreated = await _repo.create(transaction);
        const datav = new Date(); //moment.add(30, 'days')._d.toISOString());
        await _repoUser.updatePayment(datav, req.usuarioLogado.user._id);
        res.status(200).send(transactionCreated);
      } else {
        const {
          cardHash,
          name,
          email,
          phone,
          cpf,
          state,
          city,
          neighborhood,
          zipcode,
          value,
          street_number,
          street,
        } = data;
        const pagarmeTransaction = await client.transactions.create({
          amount: 6000,
          payment_method: 'credit_card',
          card_hash: cardHash,
          customer: {
            name,
            external_id: '#3311',
            email,
            type: 'individual',
            country: 'br',
            phone_numbers: [`+${phone}`],
            documents: [
              {
                type: 'cpf',
                number: cpf,
              },
            ],
          },
          billing: {
            name,
            address: {
              country: 'br',
              state,
              city,
              neighborhood,
              street,
              street_number,
              zipcode,
            },
          },
          items: [
            {
              id: '1',
              title: 'Parcela mensal do aplicativo do dev doido',
              unit_price: value ? value : 30,
              quantity: 1,
              tangible: true,
            },
          ],
          metadata: { idProduto: '1' },
        });
        const cardAux = pagarmeTransaction.card;
        const card = {
          state,
          city,
          neighborhood,
          street,
          street_number,
          name: cardAux.holder_name,
          cpf,
          phone,
          email,
          zipcode,
          card_id: cardAux.id,
          userId: req.usuarioLogado.user._id,
          brand: cardAux.brand,
          holder_name: cardAux.holder_name,
          cardNumber: `${cardAux.first_digits}******${cardAux.last_digits}`,
        };
        const cardCreated: any = await _repoCard.create(card);
        const transaction = {
          status: pagarmeTransaction.status,
          authorization_code: pagarmeTransaction.authorization_code,
          risk_level: pagarmeTransaction.risk_level,
          card: cardCreated._id,
          userId: req.usuarioLogado.user._id,
          acquirer_id: pagarmeTransaction.acquirer_id,
        };
        const transactionCreated = await _repo.create(transaction);
        const datav = new Date(); //moment.add(30, 'days')._d.toISOString());
        await _repoUser.updatePayment(datav, req.usuarioLogado.user._id);
        res.status(200).send(transactionCreated);
      }
    } catch (e) {
      let ero = '';
      if (e.response && e.response.errors) {
        ero = e.response.errors;
      } else {
        ero = e.toString();
      }
      res.status(500).send({ message: 'Internal server error', erro: ero }); // ,erro:e.response.errors[0] });
    }
  }

  async get(req, res) {
    ctrlBase.getMyAll(_repo, req, res);
  }
  async remove(req, res) {
    ctrlBase.remove(_repo, req, res);
  }
}

/*
     const objtoencrypt = JSON.stringify({
      card_number: "323232323323232",
      card_expiration_date: "32232",
      card_holder_name: 'Gustavo',
      card_cvv: '322',
    });
    const cardHash = CryptoJS.AES.encrypt(
      objtoencrypt,
      'hdfudhuidfhudhudah9d8s8f9d8a98as9d8s9d89as',
    ).toString();
*/
