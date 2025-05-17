import type { VerifyErrors } from 'jsonwebtoken'
import type { TokenType } from '@/global/constants/enum/enumUser'
import { TypeError } from '@/global/constants/enum/typeError'
import { AUTH_MESSAGES } from '@/api/auth/constants/authMessage'

const formatJWTMessage = (err: VerifyErrors, label: string, typeToken: keyof typeof TokenType) => {
  err.message = err.message.replace(/jwt/gi, label).trim()
  //example: jwt malformed => Access token malformed

  err.message = err.message.startsWith('invalid ') ? `${label} ${err.message}` : err.message
  if (err.name === 'TokenExpiredError') err.name = err.name.replace(/Token/gi, typeToken).trim()

  if (err.name === TypeError.RefreshTokenExpiredError) err.message = AUTH_MESSAGES.LOGIN_SESSION_EXPIRED

  return err
}

export default formatJWTMessage
