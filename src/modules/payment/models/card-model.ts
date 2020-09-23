export type CardModel = {
  _id: string;
  card_id: string;
  cardNumber: string;
  holder_name: string;
  name: string;
  brand: string;
  street: string;
  street_number: string;
  neighborhood: string;
  city: string;
  state: string;
  zipcode: string;
  phone: string;
  cpf: string;
  value?: Number;
  email: string;
  userId: string;
  active: boolean;
  createdAt: Date;
};

export type CardsPaginate = {
  cards: CardModel[];
  cardsCount: number;
};
