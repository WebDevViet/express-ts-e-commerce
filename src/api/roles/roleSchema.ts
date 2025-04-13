import bcrypt from 'bcrypt'
import { ObjectId } from 'mongodb'
import { UserVerifyStatus } from '~/global/constants/enum/enumUser.ts'

export interface UserType {
  id?: ObjectId
  name: string
  email: string
  dateOfBirth: Date
  password: string

  verify?: UserVerifyStatus
  emailVerificationToken?: string
  forgotPasswordToken?: string

  avatar?: string
  username?: string
  bio?: string
  location?: string
  website?: string
  coverPhoto?: string

  createdAt?: Date
  updatedAt?: Date
}

export default class User {
  _id?: ObjectId
  name: string
  email: string
  date_of_birth: Date
  password: string

  verify: UserVerifyStatus
  email_verification_token: string
  forgot_password_token: string

  avatar: string
  username: string
  bio: string
  location: string
  website: string
  cover_photo: string

  created_at: Date
  updated_at: Date

  constructor(user: UserType) {
    this._id = user.id
    this.name = user.name
    this.email = user.email
    this.date_of_birth = user.dateOfBirth
    this.password = bcrypt.hashSync(user.password, 10)

    this.verify = user.verify || UserVerifyStatus.Unverified
    this.email_verification_token = user.emailVerificationToken || ''
    this.forgot_password_token = user.forgotPasswordToken || ''

    this.avatar = user.avatar || ''
    this.username = user.username || ''
    this.bio = user.bio || ''
    this.location = user.location || ''
    this.website = user.website || ''
    this.cover_photo = user.coverPhoto || ''

    const now = new Date()
    this.created_at = user.createdAt || now
    this.updated_at = user.updatedAt || now
  }
}
