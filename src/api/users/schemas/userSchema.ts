import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { nanoid } from 'nanoid'
import { AccountType, Gender, UserStatus } from '~/global/constants/enum/enumUser'

export interface TUser {
  id?: ObjectId
  email: string
  password: string

  forgotPasswordToken?: string

  name?: string
  username?: string
  phone?: string
  gender?: Gender
  avatar?: string

  address?: string
  dateOfBirth?: Date
  role?: ObjectId
  city?: ObjectId

  accountType: AccountType
  status?: UserStatus

  likedProducts?: ObjectId[]
  viewedProducts?: ObjectId[]

  addresses?: {
    name: string
    phone: string
    city: string
    address: string
    isDefault?: boolean
  }[]

  createdAt?: Date
  updatedAt?: Date
}

export default class User {
  _id?: ObjectId
  email: string
  password: string

  forgot_password_token: string

  name: string
  username: string
  phone: string
  gender: Gender
  avatar: string

  address: string
  date_of_birth?: Date
  role?: ObjectId
  city?: ObjectId

  accountType: AccountType
  status: UserStatus

  likedProducts: ObjectId[]
  viewedProducts: ObjectId[]

  addresses: {
    name: string
    phone: string
    city: string
    address: string
    isDefault?: boolean
  }[]

  created_at: Date
  updated_at: Date

  constructor(user: TUser) {
    this._id = user.id
    this.email = user.email
    this.password = bcrypt.hashSync(user.password, 10)

    this.forgot_password_token = user.forgotPasswordToken ?? ''

    this.name = user.name ?? ''
    this.username = user.username ?? nanoid(10)
    this.phone = user.phone ?? ''
    this.gender = user.gender ?? Gender.Other
    this.avatar = user.avatar ?? ''
    this.date_of_birth = user.dateOfBirth

    this.role = user.role
    this.city = user.city

    this.address = user.address ?? ''
    this.addresses = user.addresses ?? []

    this.accountType = user.accountType
    this.status = user.status ?? UserStatus.Online

    this.likedProducts = user.likedProducts ?? []
    this.viewedProducts = user.viewedProducts ?? []

    const now = new Date()
    this.created_at = user.createdAt || now
    this.updated_at = user.updatedAt || now
  }
}
