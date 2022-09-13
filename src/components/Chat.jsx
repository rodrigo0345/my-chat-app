import React, {useRef} from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useMsg } from '../contexts/MsgContext'
import { Form, Button } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'
import Header from './Header'
import { BsFillEmojiLaughingFill, BsFillFileEarmarkImageFill } from 'react-icons/bs'
import '../styles/chat/chat.css'


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
    <>
      <Header />
      <div className="chat">
        <div className="chat-options">
          <div className="other-chat">
            <img src="https://imgs.search.brave.com/G1BmhUXIZe1h9Gr4s2xso3ON4umPfHOVfrFbA8dQaXk/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9ib2Jy/YWxleS5maWxlcy53/b3JkcHJlc3MuY29t/LzIwMTYvMDgvaW1h/Z2UxLmpwZWc_dz0x/ODAw" alt="avatar" />
            <p>Person name</p>
          </div>
          <div className="other-chat">
            <img src="https://imgs.search.brave.com/G1BmhUXIZe1h9Gr4s2xso3ON4umPfHOVfrFbA8dQaXk/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9ib2Jy/YWxleS5maWxlcy53/b3JkcHJlc3MuY29t/LzIwMTYvMDgvaW1h/Z2UxLmpwZWc_dz0x/ODAw" alt="avatar" />
            <p>Person name</p>
          </div>
          <div className="other-chat">
            <img src="https://imgs.search.brave.com/G1BmhUXIZe1h9Gr4s2xso3ON4umPfHOVfrFbA8dQaXk/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9ib2Jy/YWxleS5maWxlcy53/b3JkcHJlc3MuY29t/LzIwMTYvMDgvaW1h/Z2UxLmpwZWc_dz0x/ODAw" alt="avatar" />
            <p>Person name</p>
          </div>
          <div className="other-chat">
            <img src="https://imgs.search.brave.com/G1BmhUXIZe1h9Gr4s2xso3ON4umPfHOVfrFbA8dQaXk/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9ib2Jy/YWxleS5maWxlcy53/b3JkcHJlc3MuY29t/LzIwMTYvMDgvaW1h/Z2UxLmpwZWc_dz0x/ODAw" alt="avatar" />
            <p>Person name</p>
          </div>
          <div className="other-chat">
            <img src="https://imgs.search.brave.com/G1BmhUXIZe1h9Gr4s2xso3ON4umPfHOVfrFbA8dQaXk/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9ib2Jy/YWxleS5maWxlcy53/b3JkcHJlc3MuY29t/LzIwMTYvMDgvaW1h/Z2UxLmpwZWc_dz0x/ODAw" alt="avatar" />
            <p>Person name</p>
          </div>
          <div className="other-chat">
            <img src="https://imgs.search.brave.com/G1BmhUXIZe1h9Gr4s2xso3ON4umPfHOVfrFbA8dQaXk/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9ib2Jy/YWxleS5maWxlcy53/b3JkcHJlc3MuY29t/LzIwMTYvMDgvaW1h/Z2UxLmpwZWc_dz0x/ODAw" alt="avatar" />
            <p>Person name</p>
          </div>
          <div className="other-chat">
            <img src="https://imgs.search.brave.com/G1BmhUXIZe1h9Gr4s2xso3ON4umPfHOVfrFbA8dQaXk/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9ib2Jy/YWxleS5maWxlcy53/b3JkcHJlc3MuY29t/LzIwMTYvMDgvaW1h/Z2UxLmpwZWc_dz0x/ODAw" alt="avatar" />
            <p>Person name</p>
          </div>
          <div className="other-chat">
            <img src="https://imgs.search.brave.com/G1BmhUXIZe1h9Gr4s2xso3ON4umPfHOVfrFbA8dQaXk/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9ib2Jy/YWxleS5maWxlcy53/b3JkcHJlc3MuY29t/LzIwMTYvMDgvaW1h/Z2UxLmpwZWc_dz0x/ODAw" alt="avatar" />
            <p>Person name</p>
          </div>
          <div className="other-chat">
            <img src="https://imgs.search.brave.com/G1BmhUXIZe1h9Gr4s2xso3ON4umPfHOVfrFbA8dQaXk/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9ib2Jy/YWxleS5maWxlcy53/b3JkcHJlc3MuY29t/LzIwMTYvMDgvaW1h/Z2UxLmpwZWc_dz0x/ODAw" alt="avatar" />
            <p>Person name</p>
          </div>
          <div className="other-chat">
            <img src="https://imgs.search.brave.com/G1BmhUXIZe1h9Gr4s2xso3ON4umPfHOVfrFbA8dQaXk/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9ib2Jy/YWxleS5maWxlcy53/b3JkcHJlc3MuY29t/LzIwMTYvMDgvaW1h/Z2UxLmpwZWc_dz0x/ODAw" alt="avatar" />
            <p>Person name</p>
          </div>
          <div className="other-chat">
            <img src="https://imgs.search.brave.com/G1BmhUXIZe1h9Gr4s2xso3ON4umPfHOVfrFbA8dQaXk/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9ib2Jy/YWxleS5maWxlcy53/b3JkcHJlc3MuY29t/LzIwMTYvMDgvaW1h/Z2UxLmpwZWc_dz0x/ODAw" alt="avatar" />
            <p>Person name</p>
          </div>
          <div className="other-chat">
            <img src="https://imgs.search.brave.com/G1BmhUXIZe1h9Gr4s2xso3ON4umPfHOVfrFbA8dQaXk/rs:fit:1200:1200:1/g:ce/aHR0cHM6Ly9ib2Jy/YWxleS5maWxlcy53/b3JkcHJlc3MuY29t/LzIwMTYvMDgvaW1h/Z2UxLmpwZWc_dz0x/ODAw" alt="avatar" />
            <p>Person name</p>
          </div>
        </div>
        <div className="chat-messages">
          {loading? <div className="loading-screen"><div className="lds-ripple"><div></div><div></div></div></div>: null}
          <div className="chat-header">

          </div>
          <div className="messages">
            {//displayMessages
            }
          </div>
          <div className="chat-footer">
            <form onSubmit={send}>
              <div className="select-emoji">
                <BsFillEmojiLaughingFill/>
              </div>
              <input type="text" name="message" ref={messageWritten} placeholder="Type a message..."/>
              <div className="send">
                <button type="submit" disabled={loading} className="send-text">Send</button>
                <button
                type="submit"
                className='send-image'>
                  <BsFillFileEarmarkImageFill />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

    </>
  )
}
