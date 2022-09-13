import React, {useRef} from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useMsg } from '../contexts/MsgContext'
import { Form, Button } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'
import Header from './Header'
import { BsFillEmojiLaughingFill, BsFillFileEarmarkImageFill } from 'react-icons/bs'
import { AiOutlineCloseCircle } from 'react-icons/ai'
import { Picker } from "emoji-mart";
import '../styles/chat/chat.css'


export default function Chat() {
  const { currentUser, searchUser } = useAuth(); 
  const {messages, sendMessage, notificationsAllowed, savePhotoOnSever} = useMsg();
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [loadingScreen, setLoadingScreen] = React.useState(true);
  const [displayMessages, setDisplayMessages] = React.useState([]);
  const [input, setInput] = React.useState('');
  const messageWritten = useRef(); 

  async function send(e){
    e.preventDefault();

    const msg = messageWritten.current.value;
    const senderID = currentUser.uid;
    
    if(msg === '') return;

    // for later
    const chatID = 'geral';

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
              <p className={`msg ${msgType}`}>{msg.message}</p>
            </div>
          );
        

        return element;
    }));

    setDisplayMessages(msgs.reverse());
  }

  async function fetchUserData(id){
    const user = await searchUser(id);
    return user?.data()? {name: user.data().displayName, photo: user.data().photoURL}: {name: 'Deleted user', photo: undefined};
  }


  async function sendImage(e){
    const image = e.target.files[0];

    console.log(image);
    if(image === undefined) return;

    try{
      setLoading(true);
      setError('');
      const url = await savePhotoOnSever(image);
      await sendMessage(currentUser.uid, 'geral', url, 'image');
    }catch(error){
      setError("Failed to send image");
    }
  }

  // notifications needs work!
  useEffect(() => {
    processMessages(messages);

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

  }, [messages]);

  useEffect(() => {
    setLoadingScreen(false);
  }, []);

  //make a header component seperatly and use it here and in profile
  // style it according to +/- instagram
  
  return (
    <>
      <Header />
      <div className="chat">
        <div className="chat-options">
          <div className="other-chats-wrapper">
            
          </div>
        </div>
        <div className="chat-messages">
          {loading? <div className="loading-screen"><div className="lds-ripple"><div></div><div></div></div></div>: null}

          <div className="chat-header">
              <h1>Group: Geral</h1>
          </div>

          <div className="messages">
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
      </div>

    </>
  )
}
