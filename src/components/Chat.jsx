import React, {useRef} from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useMsg } from '../contexts/MsgContext'
import { Form, Button } from 'react-bootstrap'
import "../styles/Chat.css"
import { useAuth } from '../contexts/AuthContext'
import { useEffect } from 'react'

export default function Chat() {
  const { currentUser, searchUser } = useAuth(); 
  const {messages, sendMessage} = useMsg();
  const [error, setError] = React.useState("");
  const [loading, setLoading] = React.useState(false);
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
        const element = (
          <div className={`${sender}-msg`} key={index}>
            <p className="msg-author">{data.name}</p>
            <p className="msg">{msg.message}</p>
          </div>
        );

        return element;
    }));

    setDisplayMessages(msgs);
  }

  async function fetchUserData(id){
    const user = await searchUser(id);
    console.log(user.data());
    return user?.data()? {name: user.data().displayName, photo: user.data().photoURL}: {name: 'Unknown', photo: ''};
  }

  useEffect(() => {
    processMessages(messages);
  }, [messages]);

  return (
    <div>
      <Link to="/profile" className="user">
        <p>{currentUser.displayName}</p>
        <img id="avatar" src={currentUser.photoURL} alt="" />
      </Link>
      <div className="diplay-messages">
        { displayMessages && displayMessages.map(
          (msg) => {
          
            return msg;
          }
        ) }
      </div>
      <div className="send-message">
        <Form className='d-flex align-items-center' onSubmit={send}>
          <Form.Group name="message">
            <Form.Control disabled={loading} type="text" ref={messageWritten} required />
          </Form.Group>
          <Button type="submit" className='w-40'>
            Send
          </Button>
        </Form>
      </div>
      
    </div>
  )
}
