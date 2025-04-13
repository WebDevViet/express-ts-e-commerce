import { Router } from 'express'
const router = Router()

import apiAuth from './auth/authRoute.ts'
import apiUsers from './users/userRoute.ts'
import apiFiles from './files/fileRouter.ts'

router.use('/auth', apiAuth)
router.use('/users', apiUsers)
router.use('/files', apiFiles)

export default router
