import { validateBody, validateParams } from '~/global/utils/validate.ts'
import UserSchemaValidations from './schemas/userSchemaValidation.ts'

class UsersMiddleware extends UserSchemaValidations {
  userProfile = validateParams(this.userProfileSchema)

  updateMyProfile = validateBody(this.updateMyProfileSchema)

  followUser = validateBody(this.followedUserIdSchema)

  unfollowUser = validateParams(this.followedUserIdSchema)
}

export default new UsersMiddleware()
