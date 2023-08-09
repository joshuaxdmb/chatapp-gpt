import React, { useEffect, useState } from 'react'
import MessageFormUi from './MessageFormUi'
import {  usePostAutoCompleteMutation } from '@/state/api';

const useDebounce = (value,delay) =>{
  const [debounceValue, setDebounceValue] = useState(value)

  useEffect(()=>{
    const handler = setTimeout(()=>{
      setDebounceValue(value)
    }, delay)

    return () =>{
      clearTimeout(handler)
    }
  }, [value,delay])

  return debounceValue
}
const AiComplete = ({props,activeChat}) => {

  const [message, setMessage] = useState("");
    const [attachment,setAttachment] = useState("");
    const [trigger, resultAssist] = usePostAutoCompleteMutation();
    const [appendText, setAppendText] = useState("")

    const handleSubmit = async() =>{
        const date = new Date().toISOString().replace("T"," ").replace("Z",`${Math.floor(Math.random()*1000)}+00:00`)
        const at = attachment ? [{blob:attachment,file:attachment.name}] : []
        const form = {
            attachments:at,
            created: date,
            sender_username: props.username,
            text:message,
            activeChatId:activeChat.id
        }

        props.onSubmit(form);
        trigger(form)
        setMessage('');
        setAttachment('')
    }

    const debounceValue = useDebounce(message,1000);

    useEffect(()=>{
      if(debounceValue){
        const form = {text: message}
        trigger(form)
      }
    },[debounceValue]) //eslint-disable-line

    const handleChange =(e)=>{
        setMessage(e.target.value)
    }

    const handleKeyDown = (e) =>{
      if (e.keyCode === 9 || e.keyCode === 13){
        e.preventDefault()
        setMessage(`${message} ${appendText}`)
      }
      setAppendText("")
    }

    useEffect(()=>{
      if(resultAssist.data?.text){
        setAppendText(resultAssist.data?.text)
      }
    }, [resultAssist]) //eslint-disable-line

  return (
    <MessageFormUi 
   setAttachment={setAttachment}
   message={message}
   handleChange={handleChange}
   handleSubmit={handleSubmit}
   allowAttachments={false}
   appendText={appendText}
   handleKeyDown={handleKeyDown}
   />
  )
}

export default AiComplete