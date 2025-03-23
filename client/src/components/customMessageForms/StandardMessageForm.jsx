import React, { useState } from 'react'
import MessageFormUi from './MessageFormUi'
import { getFormattedTimestamp } from '@/components/customMessageForms/utils'

const StandardMessageForm = ({ props, activeChat }) => {
  const [message, setMessage] = useState('')
  const [attachment, setAttachment] = useState('')

  const handleSubmit = async () => {
    const timestamp = getFormattedTimestamp()
    const at = attachment ? [{ blob: attachment, file: attachment.name }] : []
    const form = {
      attachments: at,
      created: timestamp,
      sender_username: props.username,
      text: message,
      activeChatId: activeChat.id,
    }

    props.onSubmit(form)
    setMessage('')
    setAttachment('')
  }

  const handleChange = (e) => {
    setMessage(e.target.value)
  }

  return (
    <MessageFormUi
      setAttachment={setAttachment}
      message={message}
      handleChange={handleChange}
      handleSubmit={handleSubmit}
    />
  )
}

export default StandardMessageForm
