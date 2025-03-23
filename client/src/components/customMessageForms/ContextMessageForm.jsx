import React, { useState } from 'react'
import MessageFormUi from './MessageFormUi'
import { usePostUploadContextMutation } from '@/state/api'
import { getFormattedTimestamp } from '@/components/customMessageForms/utils'

const ContextMessageForm = ({ props, activeChat }) => {
  const [message, setMessage] = useState('')
  const [attachment, setAttachment] = useState('')
  const [trigger] = usePostUploadContextMutation()

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

    trigger({ text: message })

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

export default ContextMessageForm
