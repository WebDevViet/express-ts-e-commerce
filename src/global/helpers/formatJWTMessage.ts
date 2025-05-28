import type { TokenType } from '@/global/constants/enum/enumUser'
import type { VerifyErrors } from 'jsonwebtoken'

const formatJWTMessage = (err: VerifyErrors, label: string, typeToken: keyof typeof TokenType) => {
  err.message = err.message.replace(/jwt/gi, label).trim()
  //example: jwt malformed => Access token malformed

  err.message = err.message.startsWith('invalid ') ? `${label} ${err.message}` : err.message
  if (err.name === 'TokenExpiredError') err.name = err.name.replace(/Token/gi, typeToken).trim()

  return err
}

export default formatJWTMessage
