import type { Response } from 'express'
import type {
  followUserRequest,
  GetMyProfileRequest,
  GetUsernameRequest,
  GetUserProfileRequest,
  UnfollowUserRequest,
  UpdateMyProfileRequest
} from './types/userReqRes'
import usersServices from './userService'

const usersControllers = {
  getMe: async (req: GetUsernameRequest, res: Response) => {
    const username = await usersServices.getMe(req.userId)

    res.jsonify({ data: username, message: 'Get me successfully' })
  },
  getUserProfile: async (req: GetUserProfileRequest, res: Response) => {
    const user = await usersServices.getUserProfile(req.params.username)

    res.jsonify({ data: user, message: 'Get user successfully' })
  },
  getMyProfile: async (req: GetMyProfileRequest, res: Response) => {
    const user = await usersServices.getMyProfile(req.userId)

    res.jsonify({ data: user, message: 'Get profile successfully' })
  },

  updateMyProfile: async (req: UpdateMyProfileRequest, res: Response) => {
    const user = await usersServices.updateMyProfile(req.userId, req.body)

    res.jsonify({ data: user, message: 'Update profile successfully' })
  },

  followUser: async (req: followUserRequest, res: Response) => {
    await usersServices.followUser(req.userId, req.body.followedUserId)

    res.jsonify({ message: 'Follow user successfully' })
  },

  unfollowUser: async (req: UnfollowUserRequest, res: Response) => {
    await usersServices.unfollowUser(req.userId, req.params.followedUserId)

    res.jsonify({ message: 'Unfollowed user' })
  }
}

export default usersControllers
