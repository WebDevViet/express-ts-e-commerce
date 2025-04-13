/* eslint-disable no-console */
import chalk from 'chalk'
import formidable from 'formidable'
import fs from 'fs'
import createHttpError from 'http-errors'
import { UPLOAD_IMAGES_DIR, UPLOAD_TEMP_DIR } from '~/global/constants/dir.ts'
import type { Request } from 'express'

export default function initUploadFolder() {
  if (!fs.existsSync(UPLOAD_TEMP_DIR)) {
    fs.mkdirSync(UPLOAD_TEMP_DIR, {
      recursive: true // Create parent directories if they don't exist (parent is uploads folder)
    })
    console.log(chalk.greenBright('Upload folder temp created at:', UPLOAD_TEMP_DIR))
  } else {
    console.log(chalk.yellowBright('Upload folder temp already exists at:', UPLOAD_TEMP_DIR))
  }

  if (!fs.existsSync(UPLOAD_IMAGES_DIR)) {
    fs.mkdirSync(UPLOAD_IMAGES_DIR, {
      recursive: true // Create parent directories if they don't exist (parent is uploads folder)
    })
    console.log(chalk.greenBright('Upload folder images created at:', UPLOAD_IMAGES_DIR))
  } else {
    console.log(chalk.yellowBright('Upload folder images already exists at:', UPLOAD_IMAGES_DIR))
  }
}

export const handleUploadImage = async (req: Request) => {
  const form = formidable({
    uploadDir: UPLOAD_TEMP_DIR,
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 5 * 1024 * 1024, // 5mb
    filter: ({ name, mimetype }) => {
      if (name !== 'image') {
        form.emit('error' as any, createHttpError.BadRequest("Invalid field. The correct field is 'image'") as any)
        return false
      }

      if (!mimetype?.startsWith('image/')) {
        form.emit('error' as any, createHttpError.BadRequest('Invalid file type') as any)
        return false
      }

      return true
    }
  })

  const [, files]: [formidable.Fields, formidable.Files<'image'>] = await form.parse(req)

  if (!files.image) {
    throw createHttpError.BadRequest('No image file uploaded')
  }

  return files.image[0]
}
