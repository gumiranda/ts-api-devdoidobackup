export type AccountModel = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role?: string;
  pushToken?: string;
  payDay: string;
  cpf?: string;
  phone?: string;
};
export type AccountsPaginate = {
  accounts: Omit<AccountModel, 'password'>[];
  accountsCount: number;
};
export type UserData = {
  cpf: string;
  phone: string;
};
