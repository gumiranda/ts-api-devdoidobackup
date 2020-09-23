import variables from '@/bin/configuration/variables';
import pagarme from 'pagarme';
const encryption_key = variables.Pagarme.pagarmeKeyTest;
const connect = () => {
  return pagarme.client.connect({ api_key: encryption_key });
};
const generateCardHash = async (card) => {
  const client = await connect();
  return await client.security.encrypt(card);
};
const createNewTransaction = async (obj) => {
  try {
    const client = await connect();
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
    } = obj;
    return await client.transactions.create({
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
  } catch (erro) {
    if (erro?.response?.errors) {
      return erro.response.errors;
    }
    return 'Internal Server Error';
  }
};
const createTransactionByCardId = async (card) => {
  try {
    const client = await connect();
    return await client.transactions.create({
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
          unit_price: card.value ? card.value : 30,
          quantity: 1,
          tangible: true,
        },
      ],
      metadata: { idProduto: '1' },
    });
  } catch (erro) {
    if (erro?.response?.errors) {
      return erro.response.errors;
    }
    return 'Internal Server Error';
  }
};

export default {
  createNewTransaction,
  generateCardHash,
  createTransactionByCardId,
};
