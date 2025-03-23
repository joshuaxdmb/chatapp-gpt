import React from 'react'
import {
  useMultiChatLogic,
  MultiChatSocket,
  MultiChatWindow,
} from 'react-chat-engine-advanced'
import Header from '@/components/header'
import StandardMessageForm from '@/components/customMessageForms/StandardMessageForm'
import Ai from '../customMessageForms/Ai'
import AiComplete from '../customMessageForms/AiComplete'
import { Button } from 'react-bootstrap'
import ContextMessageForm from '../customMessageForms/ContextMessageForm'

const Chat = ({ user, secret, setUser, setSecret }) => {
  const chatProps = useMultiChatLogic(
    import.meta.env.VITE_PROJECT_ID,
    user,
    secret
  )

  const handleLogout = () => {
    setUser(null)
    setSecret(null)
  }
  return (
    <div style={{ height: '100%' }}>
      <MultiChatSocket {...chatProps} />
      <MultiChatWindow
        {...chatProps}
        style={{ height: '100%' }}
        renderChatHeader={(chat) => <Header chat={chat} />}
        renderMessageForm={(props) => {
          if (chatProps.chat?.title.startsWith('Assistant')) {
            return <Ai props={props} activeChat={chatProps.chat} />
          }
          if (chatProps.chat?.title.startsWith('Ai-Complete')) {
            return <AiComplete props={props} activeChat={chatProps.chat} />
          }

          if (chatProps.chat?.title.startsWith('Me')) {
            return (
              <ContextMessageForm props={props} activeChat={chatProps.chat} />
            )
          }
          return (
            <StandardMessageForm props={props} activeChat={chatProps.chat} />
          )
        }}
        renderOptionsSettings={(creds, chat) => (
          <div className='logout-button-container'>
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        )}
      />
    </div>
  )
}

export default Chat
