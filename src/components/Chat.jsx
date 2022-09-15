import React, {useRef} from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useMsg } from '../contexts/MsgContext'
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'
import Header from './Header'
import { BsFillFileEarmarkImageFill } from 'react-icons/bs'
import { GiHamburgerMenu } from 'react-icons/gi'
import '../styles/chat/chat.css'
import styled from 'styled-components'

const ChatDiv = styled.div`
    @media sceen and (max-width: 768px){
      height: calc(${window.innerHeight}px - 100px);
    }
`;



export default function Chat() {
  const { currentUser, searchUser } = useAuth(); 
  const {messages, sendMessage, notificationsAllowed, savePhotoOnServer, chats, currentChat, setCurrentChat} = useMsg();
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [displayMessages, setDisplayMessages] = React.useState([]);
  const [otherChats, setOtherChats] = React.useState([]);
  const messageWritten = useRef(); 
  const messageEl = useRef(null);

  async function send(e){
    e.preventDefault();

    const msg = messageWritten.current.value;
    const senderID = currentUser.uid;
    
    if(msg === '') return;

    // for later
    const chatID = currentChat;

    try{
      setLoading(true);
      setError('');
      await sendMessage(senderID, chatID, msg);
      e.target.message.value = "";
    }
    catch(error){
      setError("Failed to send message");
    }

    setLoading(false);
  }

  async function processMessages(messages){
    const msgs = await Promise.all(messages.map(async (msg, index) => {
        const senderID = msg.userID;
        const msgType = msg.type;

        let sender = 'other-person';
        if(currentUser.uid === senderID){
          sender = 'my';
        }

        const data = await fetchUserData(senderID);
        let element;

        // just changed the order of the photo (use justify-content: reverse)
          element = (
            <div className={`${sender}-wrapper`} key={index}>
              <div className={`${sender}-msg`}>
                {data.photo? <img src={data.photo} alt={data.name} id="avatar"/>: null}
                <p className="msg-author">{data.name}</p>
              </div>
              {msgType === "image"? 
              <a href={msg.message} target="_blank">
                <img src={msg.message}/>
              </a>:
              <p className={`msg ${msgType}`}>{msg.message}</p>}
            </div>
          );
        

        return element;
    }));

    setDisplayMessages(msgs.reverse());
  }

  async function processOtherChats(){
    const filterChats = chats.filter(async (chat, index) => {

      // check if the user is in the chat
      if(!chat.users.includes(currentUser.uid)){ return false; }

      // check if the chat is not the current chat
      if(chat.chatID === currentChat){ return false; }

      return true;
    });

    const otherChatsAux = filterChats.map( (chat, index) => {
      return (
        <div className="other-chat" onClick={() => {
          setCurrentChat(chat.chatID);
        }}>
            <img src={chat.photoURL} alt="chat-image" />
            <p>{chat.name}</p>
        </div>
      )
    })

    setOtherChats(otherChatsAux);
  }

  async function fetchUserData(id){
    const user = await searchUser(id);
    return user?.data()? {name: user.data().displayName, photo: user.data().photoURL}: {name: 'Deleted user', photo: undefined};
  }


  async function sendImage(e){
    const image = e.target.files[0];
    if(image === undefined) return;

    try{
      setLoading(true);
      setError('');
      const url = await savePhotoOnServer(currentUser.uid, 'geral', image);
      await sendMessage(currentUser.uid, 'geral', url, 'image');
    }catch(error){
      setError("Failed to send image");
    }
  }

  const  handleScroll = e => {
    let element = e.target;
    if (element.scrollTop===0) {
      //fetch messages
    }
 }

  // notifications needs work! and loads all the messages in the chat
  useEffect(() => {
    setLoading(true);
    processMessages(messages).then(() => {
      setLoading(false); 
    });

    const notify = async () => {
      if(messages[0].userID === currentUser.uid || document.hasFocus()){
        return;
      }

      const notify = await notificationsAllowed();
      if(notify){
        new Notification(`New message from ${currentUser.displayName}`, {
          body: `"${messages[0].message}"`,
          icon: messages[0].photoURL
        })
      }
    }
    notify();

    // make the user focus on the end of the chat
    if (messageEl) {
      messageEl.current.addEventListener('DOMNodeInserted', event => {
        const { currentTarget: target } = event;
        target.scroll({ top: target.scrollHeight, behavior: 'smooth' });
      });
    }

  }, [messages, currentChat]);

  // scroll to the end of the chat
  // assign default chat to geral
  useEffect(() => {
    messageEl.current.scroll({ top: messageEl.current.scrollHeight, behavior: 'smooth' });
    setCurrentChat(currentChat);
  }, []);

  useEffect(() => {
    processOtherChats();
  }, [chats]);
  
  return (
    <>
      <Header />
      <ChatDiv 
      className="chat"
      >
        <div className="chat-options">
          <div className="other-chats-wrapper">
              {otherChats}
          </div>
        </div>
        
        <div className="chat-messages">

          { loading && <div className="loading">
                <div className="loading-icon" /> 
            </div> }

          <div className="chat-header">
            <Link to="new-chat">
              click
            </Link>
              <h1>Chat: {currentChat}</h1>
          </div>

          <div className="messages" onScroll={handleScroll} ref={messageEl}>
            {displayMessages}
          </div>

          <div className="chat-footer">

            <form onSubmit={send}>

              <input 
              type="text" 
              name="message" 
              id="new-text" 
              ref={messageWritten} 
              placeholder="Type a message..."
              />

              <div className="send">
                <button type="submit" disabled={loading} className="send-text">Send</button>
                
                <div
                type="file"
                className='send-image'>
                  <label for="chooseFile">
                    <BsFillFileEarmarkImageFill />
                  </label>
                  <input 
                  onChange={sendImage}
                  type="file" 
                  id="chooseFile" 
                  accept="image/*"
                  />
                </div>
              </div>

            </form>

          </div>

        </div>
      </ChatDiv>

    </>
  )
}
