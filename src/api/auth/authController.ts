import type { Request, Response } from 'express'
import authServices from './authService'
import type {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LogoutRequest,
  OAuthGoogleRequest,
  RefreshTokenRequest,
  RegisterRequest,
  ResetPasswordRequest
  // ResendVerifyEmailRequest,
  // VerifyEmailRequest
} from './types/authReqRes'

const authControllers = {
  register: async (req: RegisterRequest, res: Response) => {
    const token = await authServices.register(req.body)

    authServices.setAuthTokenToCookies(res, token)

    res.jsonify({ status: 'CREATED', message: 'Register successfully' })
  },

  login: async (req: LoginRequest, res: Response) => {
    const token = await authServices.login(req.body)

    authServices.setAuthTokenToCookies(res, token)

    res.jsonify({ message: 'Login successfully' })
  },

  logout: async (req: LogoutRequest, res: Response) => {
    await authServices.logout(req.cookies.refreshToken)
    res.jsonify({ message: 'Logout successfully' })
  },

  refreshToken: async (req: RefreshTokenRequest, res: Response) => {
    const dataToken = await authServices.refreshToken({
      userId: req.userId,
      refreshToken: req.cookies.refreshToken,
      refreshTokenRecord: req.refreshTokenRecord
    })

    authServices.setAuthTokenToCookies(res, dataToken)

    const resData: { message: string; data?: ReturnType<typeof authServices.getTokenOptions> } = {
      message: 'Refresh token successfully'
    }

    if (req.body.serverKey) {
      resData.data = authServices.getTokenOptions(dataToken)
    }

    res.jsonify(resData)
  },

  // verifyEmail: async (req: VerifyEmailRequest, res: Response) => {
  //   const data = await authServices.verifyEmail(req.userId)
  //   res.jsonify({ data, message: 'Verify email successfully' })
  // },

  // resendVerificationEmail: async (req: ResendVerifyEmailRequest, res: Response) => {
  //   await authServices.resendVerificationEmail(req.userId)
  //   res.jsonify({ message: 'Resend verify email successfully' })
  // },

  forgotPassword: async (req: ForgotPasswordRequest, res: Response) => {
    await authServices.forgotPassword(req.body.email)
    res.jsonify({ message: 'Please check your email to reset your password' })
  },
  verifyForgotPasswordToken: async (_req: Request, res: Response) => {
    res.jsonify({ message: 'Verification forgot password token successfully' })
  },

  resetPassword: async (req: ResetPasswordRequest, res: Response) => {
    await authServices.resetPassword(req.userId, req.body.password)
    res.jsonify({ message: 'Reset password successfully' })
  },

  changePassword: async (req: ChangePasswordRequest, res: Response) => {
    await authServices.changePassword(req.userId, req.body)
    res.jsonify({ message: 'Change password successfully' })
  },

  oauthGoogle: async (req: OAuthGoogleRequest, res: Response) => {
    const { accessToken, refreshToken, newUser } = await authServices.oauthGoogle(req.query.code)
    const urlRedirect = `${process.env.CLIENT_OAUTH_LOGIN_URL}?access-token=${accessToken}&refresh-token=${refreshToken}&new-user=${newUser}`
    res.redirect(urlRedirect)
  }
}

export default authControllers
