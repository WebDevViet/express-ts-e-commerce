import createHttpError from 'http-errors'
import { z } from 'zod'
import userZod from '~/api/users/schemas/userZod.ts'
import type { SchemaTypes } from '~/global/helpers/types/typeRequest.ts'
import { USERS_MESSAGES } from '../constants/usersMessage.ts'
import usersServices from '../userService.ts'

export default class UserSchemaValidations {
  userProfileSchema = userZod.pick({ username: true })

  updateMyProfileSchema = userZod
    .pick({
      name: true,
      dateOfBirth: true,
      bio: true,
      location: true,
      website: true
    })
    .extend({
      username: userZod.shape.username.refine(async (username) => {
        const user = await usersServices.getUserByUsername(username)
        if (user) throw createHttpError.Conflict(USERS_MESSAGES.USERNAME_ALREADY_EXISTS)
        return true
      })
    })
    .partial()

  followedUserIdSchema = z.object({
    followedUserId: userZod.shape.id.refine(async (id) => {
      const user = await usersServices.getUserById(id)
      if (!user) throw createHttpError.NotFound(USERS_MESSAGES.USER_TO_FOLLOW_NOT_FOUND)
      return true
    })
  })
}

export type UserSchemaTypes = SchemaTypes<UserSchemaValidations>
