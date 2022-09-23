export interface IUser {
  _id?: string
  email: string
  password: string
  firstName?: string
  lastName?: string
  phone?: string
  photo?: string
  active?: string
  role?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface CustomRequest {
  user: IUser
  file: object
  params: object
  query: object
  path: object
}

export interface IShop {
  _id?: string
  name: string
  address: string
  vendor: string
  active: string
  createdAt?: Date
  updatedAt?: Date
}

export interface IMessage {
  _id?: string
  message: string
  channel: string
  user: string
  createdAt?: Date
  updatedAt?: Date
}

export interface IChannel {
  _id?: string
  name: string
  type: string
  members: string
  createdAt?: Date
  updatedAt?: Date
}

export interface IAppiontment {
  _id?: string
  customer: string
  vendor: string
  shop: string
  day: Date
  time: string
  status: string
  reason: string
  createdAt?: Date
  updatedAt?: Date
}

export interface ILogin {
  email: string
  password: string
}

export interface Search {
  $search: string;
}
interface Person {
  $search: string;
}

export interface IFilter {
  verified?: string
  role?: string
  $text: Person;
}

export interface IShopQuery {
  vendor?: string;
  $text: Search;
}

export interface IAppQuery {
  vendor?: string;
  status: string;
  $text: Search;
}

export interface ILog {
  _id: string;
  message: string;
  appiontment: string;
  shop: string;
  owner: string;
  createdAt?: Date
  updatedAt?: Date
}
