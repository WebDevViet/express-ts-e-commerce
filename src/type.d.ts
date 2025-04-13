import type { ObjectId } from 'mongodb'
import type { JsonifyOptions } from '~/core/middlewares/jsonify'

declare global {
  namespace Express {
    interface Request {
      userId?: ObjectId
    }

    interface Response {
      jsonify: (responseData: JsonifyOptions) => any
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string

      PORT: string
      SERVER_URL: string

      URL_CLIENT: string

      DEFAULT_SECRET_KEY: string

      ACCESS_TOKEN_SECRET_KEY: string
      ACCESS_TOKEN_EXPIRES_IN: string

      REFRESH_TOKEN_SECRET_KEY: string
      REFRESH_TOKEN_EXPIRES_IN: string

      IRON_SECRET_KEY: string

      EMAIL_VERIFICATION_TOKEN_SECRET_KEY: string
      EMAIL_VERIFICATION_TOKEN_EXPIRES_IN: string

      FORGOT_PASSWORD_TOKEN_SECRET_KEY: string
      FORGOT_PASSWORD_TOKEN_EXPIRES_IN: string

      MONGO_DATABASE: string
      MONGO_HOST: string
      MONGO_USER: string
      MONGO_PASSWORD: string
      MONGO_URI: string

      GOOGLE_CLIENT_ID: string
      GOOGLE_CLIENT_SECRET: string
      GOOGLE_REDIRECT_URI: string
      GOOGLE_OAUTH_TOKEN_URL: string
      GOOGLE_OAUTH_USERINFO_URL: string

      CLIENT_OAUTH_LOGIN_URL: string
    }
  }
}

export {}
