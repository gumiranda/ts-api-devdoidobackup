export type TransactionModel = {
  _id: string;
  status: string;
  authorization_code: string;
  risk_level: string;
  acquirer_id: string;
  userId: string;
  cardId: string;
  active: boolean;
  createdAt: Date;
};
export type TransactionModelRequest = {
  cardHash?: string;
  card_id?: string;
  name: string;
  email: string;
  phone: string;
  cpf: string;
  state: string;
  city: string;
  neighborhood: string;
  zipcode: string;
  value: string;
  street_number: string;
  street: string;
  createdAt: Date;
};
