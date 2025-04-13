import { Router } from 'express'
import filesControllers from './fileController'
import { reqHandler } from '~/global/utils/reqHandler'

const router = Router()

router.post('/upload-image', reqHandler(filesControllers.uploadImage))

export default router
