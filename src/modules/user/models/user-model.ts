import { ObjectId } from 'mongodb';

export type UserModel = {
  _id: string;
  name?: string;
  email: string;
  password: string;
  payDay?: string;
  role?: string;
  faceId?: string;
  pushId?: string;
  photo_url?: string;
  cpf?: string;
  phone?: string;
  coord?: any;
  distance?: Number;
  plan?: string;
  cnpj?: string;
  city?: string;
  address?: string;
  complement?: string;
  description?: string;
  intervalAppointment?: Number;
  days1?: Days[];
  days2?: Days[];
  hourStart1?: string;
  hourStart2?: string;
  hourEnd1?: string;
  hourEnd2?: string;
  hourLunchStart1?: string;
  hourLunchEnd1?: string;
  hourLunchStart2?: string;
  hourLunchEnd2?: string;
  ownerId?: ObjectId;
  numFollowers?: Number;
  numFollowing?: Number;
  numLikes?: Number;
  numDislikes?: Number;
  likes?: Like[];
  dislikes?: DisLike[];
  services?: Services[];
  following?: Follower[];
  followers?: Follower[];
  photos?: Photo[];
  avatar?: Photo;
  emailConfirmation?: boolean;
  active?: boolean;
  face?: boolean;
  createdAt?: Date;
};

//25.0000188,-71.0087548
export type UsersPaginate = {
  users: Omit<UserModel, 'password'>[];
  usersCount: number;
};
export type Like = {
  likedBy: string;
};
export type Photo = {
  url: string;
  photo_id: string;
};
export type DisLike = {
  dislikedBy: string;
};
export type Follower = {
  followedBy: string;
};
export type Services = {
  serviceId: ObjectId;
};
export type UserData = Omit<
  UserModel,
  | 'plan'
  | 'followers'
  | 'following'
  | 'numDislikes'
  | 'numLikes'
  | 'numFollowing'
  | 'numFollowers'
  | 'ownerId'
  | 'role'
  | 'email'
  | '_id'
  | 'password'
  | 'createdAt'
  | 'emailConfirmation'
  | 'faceId'
>;
export type UserDataOwner = Omit<
  UserModel,
  | 'plan'
  | 'followers'
  | 'following'
  | 'numDislikes'
  | 'numLikes'
  | 'numFollowing'
  | 'numFollowers'
  | 'role'
  | 'email'
  | '_id'
  | 'password'
  | 'createdAt'
  | 'emailConfirmation'
  | 'faceId'
>;
export type Days = {
  monday: boolean;
  sunday: boolean;
  thursday: boolean;
  wednesday: boolean;
  tuesday: boolean;
  friday: boolean;
  saturday: boolean;
};
