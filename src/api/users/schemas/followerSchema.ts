import { ObjectId } from 'mongodb'

export interface FollowersType {
  id?: ObjectId
  userId: ObjectId
  followedUserId: ObjectId

  createdAt?: Date
  updatedAt?: Date
}

export default class Follower {
  _id?: ObjectId
  user_id: ObjectId
  followed_user_id: ObjectId

  created_at: Date
  updated_at: Date

  constructor(user: FollowersType) {
    this._id = user.id
    this.user_id = user.userId
    this.followed_user_id = user.followedUserId

    const now = new Date()
    this.created_at = user.createdAt || now
    this.updated_at = user.updatedAt || now
  }
}
