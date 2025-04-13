import { Router } from 'express'
const router = Router()

import apiAuth from './auth/authRoute'
import apiUsers from './users/userRoute'
import apiFiles from './files/fileRouter'

router.use('/auth', apiAuth)
router.use('/users', apiUsers)
router.use('/files', apiFiles)

export default router
