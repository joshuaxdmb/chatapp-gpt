import React from 'react'
import {ChatBubbleLeftRightIcon, PhoneIcon} from '@heroicons/react/24/solid'
const Header = ({chat}) => {
    console.log(chat.title)
  return (
    <div className='chat-header'>
    <div className='flexbetween'>
        <ChatBubbleLeftRightIcon className='icon-chat'/>
        {chat.title==="Create a chat!"?
        <h3 className='header-text'>Create a Chat</h3>
        :<h3 className='header-text'>{chat.title}</h3>
        }
    </div>
    <div className='flexbetween'>
        <PhoneIcon className='icon-chat'/>
        {chat.description ==="⬅️ ⬅️ ⬅️"?
        <h3 className='header-text'> </h3>
        :<h3 className='header-text'>{chat.description}</h3>
        }
    </div>
    </div>
  )
}

export default Header