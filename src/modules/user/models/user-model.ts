export type UserModel = {
  _id: string;
  name: string;
  email: string;
  password: string;
  payDay: string;
  role?: string;
  pushId?: string;
  cpf?: string;
  phone?: string;
  coord?: any;
  distance?: Number;
  plan?: string;
  createdAt: Date;
};
//25.0000188,-71.0087548
export type UsersPaginate = {
  users: Omit<UserModel, 'password'>[];
  usersCount: number;
};
export type UserData = {
  cpf: string;
  phone: string;
};
