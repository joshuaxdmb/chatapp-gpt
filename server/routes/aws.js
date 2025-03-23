import express from 'express'
import dotenv from 'dotenv'
import AWS from 'aws-sdk'
import fs, { existsSync } from 'fs'

dotenv.config()

const s3 = new AWS.S3()

const router = express.Router()
const CONTEXT_PATH = './routes/context/context.txt'
const BUCKET_NAME = 'chatappgpt-bucket'
const S3_KEY = 'context.txt'

const uploadToS3 = async () => {
  const uploadParams = {
    Bucket: BUCKET_NAME,
    Key: S3_KEY,
    Body: fs.createReadStream(CONTEXT_FILE_PATH),
  }

  return s3.upload(uploadParams).promise()
}

router.post('/upload-context', async (req, res) => {
  try {
    const { text } = req.body
    if (!existsSync(CONTEXT_PATH)) {
      fs.writeFileSync(CONTEXT_PATH, '')
    }

    fs.appendFileSync(CONTEXT_PATH, '\n' + text)

    const result = await uploadToS3()
    console.log('File uploaded successfully:', result.Location)
  } catch (e) {
    console.error('Upload error', e)
    res.status(500).json({ error: e.message })
  }
})

export default router
