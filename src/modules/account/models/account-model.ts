export type AccountModel = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role?: string;
  pushToken?: string;
  payDay: string;
};
export type AccountsPaginate = {
  accounts: Omit<AccountModel, 'password'>[];
  accountsCount: number;
};
