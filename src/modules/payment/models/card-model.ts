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
  email: string;
  userId: string;
  active: boolean;
  createdAt: Date;
};

//25.0000188,-71.0087548
export type CardsPaginate = {
  cards: CardModel[];
  cardsCount: number;
};
