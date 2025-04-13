import type { JwtPayload } from 'jsonwebtoken'
import type { TokenType, UserVerifyStatus } from '../constants/enum/enumUser'

export interface TokenPayload extends JwtPayload {
  userId: string
  tokenType: TokenType
}

export interface AccessTokenPayload extends TokenPayload {
  userVerifyStatus: UserVerifyStatus
}
