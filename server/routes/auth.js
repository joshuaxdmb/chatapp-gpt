import express from "express";
import axios from 'axios'
import dotenv from 'dotenv';

dotenv.config()

const router = express.Router();

router.post('/signup',async(req,res)=>{
    console.log(process.env.CHAT_ENGINE_KEY)
    try{
        const {username, password} = req.body
        const chatEngineResponse = await axios.post(
            "https://api.chatengine.io/users/",
            {
                "username":username,
                "secret":password
            },
            {headers:{   
                "PRIVATE-KEY": process.env.CHAT_ENGINE_KEY
            }}
        )
        console.log('CHAT RESPONSE',chatEngineResponse)
        res.status(200).json({username:chatEngineResponse.data.username,password})

    } catch(e) {
        console.error("Error",e)
        res.status(500).json({error:e.message})
    }
})

router.post('/login',async(req,res)=>{
    try{
        const {username, password} = req.body
        const chatEngineResponse = await axios.get(
            "https://api.chatengine.io/users/me",
            {headers:{   
                "Project-ID": process.env.PROJECT_ID,
                "User-Name":username,
                "User-Secret":password
            }}
        )
        console.log('Response',chatEngineResponse)
        res.status(200).json({username:chatEngineResponse.data.username,password})

    } catch(e) {
        console.error("Error",e)
        res.status(500).json({error:e.message})
    }
})

export default router