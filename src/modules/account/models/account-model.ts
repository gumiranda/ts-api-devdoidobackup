export type AccountModel = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role?: string;
  pushToken?: string;
};
export type AccountsPaginate = {
  accounts: AccountModel[];
  accountsCount: number;
};
