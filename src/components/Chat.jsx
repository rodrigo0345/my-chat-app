import React, {useRef} from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useMsg } from '../contexts/MsgContext'
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'
import Header from './Header'
import { BsFillFileEarmarkImageFill } from 'react-icons/bs'
import { Alert } from 'react-bootstrap'
import { AiOutlineUsergroupAdd } from 'react-icons/ai'
import '../styles/chat/chat.css'
import styled from 'styled-components'
import { requestForToken, messaging } from '../firebase'

const ChatDiv = styled.div`
`;

const ChatWrap = styled.div`
height: ${window.innerHeight}px;
overflow-y: hidden;
`;



export default function Chat() {
  const { currentUser, searchUser } = useAuth(); 
  const {messages, sendMessage, notificationsAllowed, savePhotoOnServer, chats, currentChat, setCurrentChat, fetchMoreMessages} = useMsg();
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [displayMessages, setDisplayMessages] = React.useState([]);
  const [otherChats, setOtherChats] = React.useState([]);

  const messageWritten = useRef(); 
  const messageEndRef = useRef(null);
  const messageEl = useRef(null);

  async function send(e){
    e.preventDefault();

    const msg = messageWritten.current.value;
    const senderID = currentUser.uid;
    
    if(msg === '') return;

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
        // scroll to this element
        let classNm = undefined;
        if(index === 0) {
         classNm = 'scrollToThis';
        }

        const senderID = msg.userID;
        const msgType = msg.type;

        let sender = 'other-person';
        if(currentUser.uid === senderID){
          sender = 'my';
        }

        const data = await fetchUserData(senderID);
        let element;

        // room for improvement
        const time = `
          ${msg.timestamp.toDate().getHours()}:${msg.timestamp.toDate().getMinutes()}min
        `;

        // just changed the order of the photo (use justify-content: reverse)
          element = (
            <div className={`${sender}-wrapper ${classNm? classNm: ''}`} key={index}>
              <div className={`${sender}-msg`}>
                {data.photo? <img src={data.photo} alt={data.name} id="avatar"/>: null}
                <p className="msg-author">{data.name}</p>
                <span>{time}</span>
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
      const element = (
        <div className="other-chat" onClick={() => {
          setCurrentChat(chat.chatID);
        }}>
            <img src={chat.photoURL} alt="chat-image" />
            <p>{chat.name}</p>
        </div>
      )
      if(chat.users[0] === 'all')
      {
        return element;
      }

      if(chat.users.find(element => element.id === currentUser.uid))
      {
        return element;
      }

      return null;
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

  const handleScroll = e => {
    let element = e.target;
    if (element.scrollTop===0) {
      const lastEl = document.getElementsByClassName('scrollToThis');

      if(lastEl)
      { 
        for(let i = 0; i < lastEl.length; i++){
          lastEl[i].classList.remove('scrollToThis'); 
        }
      } 

      //fetch messages
      try{
        fetchMoreMessages(currentChat);
      }catch(error){
        setError("Failed to fetch more messages");
        console.log(error);
      }

    }
 }

 const automaticScrolling = () => {
  // make the user focus on the end of the chat
  if(messageEl.current?.scrollHeight < 600){
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }
  const snapOnOldMessages = document.getElementsByClassName('scrollToThis')[0];
  if(snapOnOldMessages !== undefined){
    snapOnOldMessages.scrollIntoView({ behavior: "smooth" });
  }
 }

 const requestNotificationPermission = () => {
    console.log('requesting permission...');
    Notification.requestPermission().then(() => {
      notifications();
    }).catch((err) => {
      console.log('Unable to get permission to notify.', err);
    });
}
 

 const notifications = async () => {
  requestForToken();
 }

  // notifications needs work! and loads all the messages in the chat
  useEffect(() => {
    setLoading(true);
    processMessages(messages).then(() => {
      setLoading(false); 
    });

    notifications();
    automaticScrolling();

  }, [messages, currentChat]);

  // assign default chat to geral
  useEffect(() => {
    setCurrentChat(currentChat);
  }, []);

  useEffect(() => {
    processOtherChats();
  }, [chats]);
  
  return (
    <>
      <ChatWrap className="wrap-chat">
        <Header chats={otherChats}/>
        <ChatDiv
        className="chat">
          <div className="chat-options">
            <div className="chat-options-header">
              <abbr title="Create a new chat" className="legends">
                <Link to="new-chat" className='new-chat'>
                    <AiOutlineUsergroupAdd id="icon"/>
                </Link>
              </abbr>
            </div>
            <div className="other-chats-wrapper">
                {otherChats}
            </div>
          </div>
        
          <div className="chat-messages">
            { loading && <div className="loading">
                  <div className="loading-icon" />
              </div> }
            <div className="chat-header">
                { (error && <Alert variant="danger" id="err">{error}</Alert>) || <h1>Chat: {currentChat}</h1> }
            </div>
            <div className="messages" onScroll={handleScroll} ref={messageEl}>
              {displayMessages}
              <div ref={messageEndRef}/>
            </div>
            <div className="chat-footer">
              <form onSubmit={send}>
                <input
                type="text"
                name="message"
                id="new-text"
                ref={messageWritten}
                autoComplete="off"
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
      </ChatWrap>
      
    </>
  )
}
