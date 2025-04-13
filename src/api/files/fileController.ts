import type { Request, Response } from 'express'
import filesServices from './fileService'

const filesControllers = {
  uploadImage: async (req: Request, res: Response) => {
    const data = await filesServices.uploadImage(req)

    res.jsonify({ status: 'CREATED', data, message: 'Upload image successfully' })
  }
}

export default filesControllers
