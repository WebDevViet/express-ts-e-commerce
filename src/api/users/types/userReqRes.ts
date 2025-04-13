import type { Request } from 'express'
import type { ParamsDictionary } from 'express-serve-static-core'
import type { UserId } from '~/global/types/common'
import type { TUser } from '../schemas/userSchema'
import type { UserSchemaTypes } from '../schemas/userSchemaValidation'

// Get username
export type GetUsernameRequest = UserId

export type UsernameResult = Required<TUser>['username']

// Get user profile
export type GetUserProfileRequest = Request<UserSchemaTypes['userProfileSchema']>

export type UserProfileResult = Omit<
  Required<TUser>,
  'createdAt' | 'updatedAt' | 'verify' | 'emailVerificationToken' | 'forgotPasswordToken' | 'password'
>

// Get my profile
export type GetMyProfileRequest = UserId

export type MyProfileResult = Omit<
  Required<TUser>,
  'password' | 'forgotPasswordToken' | 'addresses' | 'role' | 'city' | 'status'
>

// Update my profile
export type UpdateMyProfileRequest = Request<ParamsDictionary, any, UserSchemaTypes['updateMyProfileSchema']> & UserId

// Follow user
export type followUserRequest = Request<ParamsDictionary, any, UserSchemaTypes['followedUserIdSchema']> & UserId

// Unfollow user
export type UnfollowUserRequest = Request<UserSchemaTypes['followedUserIdSchema']> & UserId
