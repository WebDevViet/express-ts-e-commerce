import { Router } from 'express'
const router = Router()

import apiAuth from './auth/authRoute'
import apiUsers from './users/userRoute'

router.use('/auth', apiAuth)
router.use('/users', apiUsers)

export default router
