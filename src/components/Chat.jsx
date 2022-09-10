import React from 'react'
import { Link, Navigate } from 'react-router-dom'
import { useMsg } from '../contexts/MsgContext'
import { Form, Button } from 'react-bootstrap'
import "../styles/Chat.css"
import { useAuth } from '../contexts/AuthContext'

export default function Chat() {
  const { currentUser, searchUser } = useAuth(); 
  const {getMessages, sendMessage} = useMsg();
  const [messages, setMessages] = React.useState("");
  const [error, setError] = React.useState("");

  async function send(e){
    e.preventDefault();
  }

  async function get(){

    try{
      const msgs = await getMessages();
      setMessages(msgs);
      console.log(msgs);

    } catch(error) {
      console.warn(error);
      setError(error.message);
    }

  }

  async function processMessages(messages){
    return messages.map((msg, index) => {
        let sender = 'other-person';
        let message = msg.message;
        let userID = msg.senderID;

        // used for latter in development
        let chat = msg.chatID;

        let photoURL, displayName;

        if(msg.senderID === currentUser.id)
        {
          sender = 'my';
          photoURL = currentUser.photoURL;
          displayName = currentUser.displayName;
        }
        else{
          try{
            const user = searchUser(userID);
            console.log('user', user);

          } catch(error){
            console.warn(error);
            setError(error.message);
            return;
          }
        }
        return (
          <div key={index} className={`${sender}-msg`}>
            <img src={photoURL} alt="avatar" />
            <p className="msg-author">{displayName}</p>
            <p className="msg">{message}</p>
          </div>
        )
      })
  }

  React.useEffect(() => {
    get();
  }, [])

  return (
    <>
      <Link to="/profile" className="user">
        <p>{currentUser.displayName}</p>
        <img id="avatar" src={currentUser.photoURL} alt="" />
      </Link>
      <div className="diplay-messages">

        { /*&& processMessages(messages)*/ }
        <div className="other-person-msg">
          <p className="msg-author">rodrigo123</p>
          <p className="msg">Boas malta, tudo fixe?</p>
        </div>
        
        <div className="my-msg">
          <p className="msg-author">Rodrigo123</p>
          <p className="msg">Adeus</p>
        </div>
      </div>
      <div className="send-message">
        <Form className='d-flex align-items-center' onSubmit={send}>
          <Form.Group id="message">
            <Form.Control type="text" required />
          </Form.Group>
          <Button type="submit" className='w-40'>
            Send
          </Button>
        </Form>
        </div>
      
    </>
  )
}
