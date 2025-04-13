import { Router } from 'express'
import filesControllers from './fileController.ts'
import { reqHandler } from '~/global/utils/reqHandler.ts'

const router = Router()

router.post('/upload-image', reqHandler(filesControllers.uploadImage))

export default router
