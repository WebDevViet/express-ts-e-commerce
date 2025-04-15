import { Router } from 'express'
const apiRoutes = Router()

import apiAuth from './auth/authRoute'
import apiUsers from './users/userRoute'

apiRoutes.use('/auth', apiAuth)
apiRoutes.use('/users', apiUsers)

export default apiRoutes
