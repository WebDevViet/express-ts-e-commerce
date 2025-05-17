import { Router } from 'express'
import { reqHandler } from '@/global/utils/reqHandler'
import authControllers from './authController'
import authMiddlewares from './authMiddleware'

const router = Router()

/** Register a new user
 * @route POST /api/auth/register
 * @body { email: string, password: string }
 */
router.post('/register', authMiddlewares.register, reqHandler(authControllers.register))

/** Login
 * @route POST /api/auth/login
 * @body { email: string, password: string }
 */
router.post('/login', authMiddlewares.login, reqHandler(authControllers.login))

/** Logout
 * @route POST /api/auth/logout
 * @cookies { Authorization: Bearer <token>, refresh-token: <token> }
 * @body { refreshToken: string }
 */
router.post('/logout', authMiddlewares.logout, reqHandler(authControllers.logout))

/** Refresh token
 * @route POST /api/auth/refresh-token
 * @cookies { refresh-token: <token> }
 */
router.post(
  '/refresh-token',
  authMiddlewares.refresh,
  authMiddlewares.reqFromServer(process.env.NEXTJS_SERVER_KEY),
  reqHandler(authControllers.refreshToken)
)

/** Verify email
 * @route POST /api/auth/verify-email
 * @cookies { Authorization: Bearer <token> }
 * @body { emailVerificationToken: string }
 */
// router.post(
//   '/verify-email',
//   authMiddlewares.accessToken,
//   authMiddlewares.verifyEmail,
//   reqHandler(authControllers.verifyEmail)
// )

/** Resend verification email
 * @route POST /api/auth/resend-verify-email
 * @cookies { Authorization: Bearer <token> }
 */
// router.post('/resend-verify-email', authMiddlewares.accessToken, reqHandler(authControllers.resendVerificationEmail))

/** Forgot password
 * @route POST /api/auth/forgot-password
 * @body { email: string }
 */
// router.post('/forgot-password', authMiddlewares.forgotPassword, reqHandler(authControllers.forgotPassword))

/** Verify forgot password token
 * @route POST /api/auth/verify-forgot-password-token
 * @body { forgotPasswordToken: string }
 */
// router.post(
//   '/verify-forgot-password-token',
//   authMiddlewares.verifyForgotPasswordToken,
//   reqHandler(authControllers.verifyForgotPasswordToken)
// )

/** Reset password
 * @route POST /api/auth/reset-password
 * @body { resetPasswordToken: string, password: string, confirmPassword: string }
 */
// router.post('/reset-password', authMiddlewares.resetPassword, reqHandler(authControllers.resetPassword))

/** Change Password
 * @route POST /api/auth/change-password
 * @cookies { Authorization: Bearer <token> }
 * @body { oldPassword: string, newPassword: string, confirmNewPassword: string }
 */
// router.put(
//   '/change-password',
//   authMiddlewares.verifiedUser,
//   authMiddlewares.changePassword,
//   reqHandler(authControllers.changePassword)
// )

/** OAuth Google
 * @route GET /api/auth/oauth/google
 * @query { code: string }
 */
// router.get('/oauth/google', reqHandler(authControllers.oauthGoogle))

export default router
