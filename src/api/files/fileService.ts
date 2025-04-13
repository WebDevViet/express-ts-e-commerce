import type { Request } from 'express'
import fs from 'fs'
import path from 'path'
import { pick } from 'radashi'
import sharp from 'sharp'
import { handleUploadImage } from '~/core/file/initUploadFolder.ts'
import { UPLOAD_IMAGES_DIR } from '~/global/constants/dir.ts'

class FilesServices {
  uploadImage = async (req: Request) => {
    const file = await handleUploadImage(req)

    const imagePath = path.resolve(UPLOAD_IMAGES_DIR, `${path.parse(file.newFilename).name}.jpg`)
    await sharp(file.filepath).jpeg().toFile(imagePath)

    fs.unlinkSync(file.filepath)

    return { ...pick(file, ['originalFilename', 'size']), imagePath }
  }
}

export default new FilesServices()
