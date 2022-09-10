import React from 'react'
import { Navigate } from 'react-router-dom'
import { useMsg } from '../contexts/MsgContext'
import { Form, Button, Card, Alert, Container } from 'react-bootstrap'
import "../styles/Chat.css"
import { useAuth } from '../contexts/AuthContext'

export default function Chat() {
  const { currentUser } = useAuth(); 
  const getMessages = useMsg();
  const sendMessage = useMsg();
  const [messages, setMessages] = React.useState("");
  const [error, setError] = React.useState("");

  async function send(e){
    e.preventDefault();
  }

  async function get(){

    try{
      const msgs = await getMessages();
      setMessages(msgs);

    } catch(error) {
      console.warn(error);
      setError(error.message);
    }

  }

  function processMessages(messages){
    return messages.map((msg, index) => {
        let sender = 'other-person';
        if(msg.senderID === currentUser.id)
        {
          sender = 'my';
        }
        return (
          <div key={index} className={`${sender}-msg`}>
            <p className="msg-author">{}</p>
            <p className="msg">Boas malta, tudo fixe?</p>
          </div>
        )
      })
  }

  return (
    <>
      <div className="diplay-messages">

        { messages && messages.map((msg, index) => {
          let sender = 'other-person';
          if(msg.senderID === currentUser.id)
          {

          }
          return (
            <div key={index}>
              <p>{msg}</p>
            </div>
          )
        })}
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
