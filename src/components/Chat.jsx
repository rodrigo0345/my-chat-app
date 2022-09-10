import React from 'react'
import { Navigate } from 'react-router-dom'
import { useMsg } from '../contexts/MsgContext'
import { Form, Button, Card, Alert, Container } from 'react-bootstrap'
import "../styles/Chat.css"

export default function Chat() {
  const getMessages = useMsg();
  const sendMessage = useMsg();

  async function send(e){
    e.preventDefault();
  }

  function get(){

  }

  return (
    <>
      <div className="diplay-messages">
        <p className="other-person-msg">Olá ai</p>
        <p className="my-msg">Adeus</p>
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
