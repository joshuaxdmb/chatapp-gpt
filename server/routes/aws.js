import express from "express";
import dotenv from 'dotenv';
import AWS from 'aws-sdk'
import fs, { existsSync } from 'fs'

dotenv.config()

const s3 = new AWS.S3()

const router = express.Router();
const contextPath = './routes/context/context.txt'

router.post('/upload-context',async(req,res)=>{
    try{
        const {text} = req.body
    if(!existsSync(contextPath)){
        fs.writeFileSync(contextPath,'')
    }

    fs.appendFileSync(contextPath,'\n'+text)

    const uploadParams = {
        Bucket: "chatappgpt-bucket",
        Key: "/context.txt",
        Body: fs.createReadStream(contextPath)
    }

    s3.upload(uploadParams, (err,data)=>{
        if (err) {
            console.log("Error uploading file:", err);
          } else {
            console.log("File uploaded successfully. Location:", data.Location);
          }
    })

    } catch(e){
        console.error("Error",e)
        res.status(500).json({error:e.message})
    }


})

export default router
