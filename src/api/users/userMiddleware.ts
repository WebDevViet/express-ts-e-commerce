import { validateBody, validateParams } from '@/global/utils/validate'
import UserSchemaValidations from './schemas/userSchemaValidation'

class UsersMiddleware extends UserSchemaValidations {
  userProfile = validateParams(this.userProfileSchema)

  updateMyProfile = validateBody(this.updateMyProfileSchema)

  followUser = validateBody(this.followedUserIdSchema)

  unfollowUser = validateParams(this.followedUserIdSchema)
}

export default new UsersMiddleware()
