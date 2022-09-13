import React, {useRef} from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useMsg } from '../contexts/MsgContext'
import { Form, Button } from 'react-bootstrap'
import "../styles/Chat.css"
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'
import styled from 'styled-components'

const ChatComponent = styled.div`
  @media screen and (max-width: 768px) {
    height: ${window.innerHeight}px;
  }
`

const ChatWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
`

export default function Chat() {
  const { currentUser, searchUser } = useAuth(); 
  const {messages, sendMessage, notificationsAllowed} = useMsg();
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [loadingScreen, setLoadingScreen] = React.useState(true);
  const [displayMessages, setDisplayMessages] = React.useState([]);
  const messageWritten = useRef(); 

  async function send(e){
    e.preventDefault();

    const msg = messageWritten.current.value;
    const senderID = currentUser.uid;

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

        let sender = 'other-person';
        if(currentUser.uid === senderID){
          sender = 'my';
        }

        const data = await fetchUserData(senderID);
        let element;

        // just changed the order of the photo (use justify-content: reverse)
          element = (
            <div className={`${sender}-wrapper`} key={index}>
              {data.photo? <img src={data.photo} alt={data.name} id="avatar"/>: null}
              <div className={`${sender}-msg`}>
                <p className="msg-author">{data.name}</p>
                <p className="msg">{msg.message}</p>
              </div>
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
    <></>
  )
}
