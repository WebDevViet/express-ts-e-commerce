import type { ObjectId } from 'mongodb'
import { getRefreshTokenExpires } from '@/global/helpers/handleJWT'

export interface RefreshTokenType {
  id?: ObjectId
  token: string
  userId: ObjectId
  createdAt?: Date
  updatedAt?: Date
  expiresAt?: Date
}

export default class RefreshToken {
  _id?: ObjectId
  token: string
  user_id: ObjectId
  created_at: Date
  updated_at: Date
  expires_at: Date

  constructor(refreshToken: RefreshTokenType) {
    const now = new Date()

    this._id = refreshToken.id
    this.token = refreshToken.token
    this.user_id = refreshToken.userId
    this.created_at = refreshToken.createdAt || now
    this.updated_at = refreshToken.updatedAt || now
    this.expires_at = refreshToken.expiresAt || getRefreshTokenExpires()
  }
}
