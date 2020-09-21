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
