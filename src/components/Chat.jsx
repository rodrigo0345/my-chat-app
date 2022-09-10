import React from 'react'
import { Navigate } from 'react-router-dom'
import { useMsg } from '../contexts/MsgContext'
import { Form, Button, Card, Alert, Container } from 'react-bootstrap'

export default function Chat() {
  const getMessages = useMsg();
  const sendMessage = useMsg();


  return (
    <>
      <div className="diplay-messages">
        <p className="other-person-msg">Olá ai</p>
        <p className="my-msg">Adeus</p>
      </div>
      <div className="send-message">
        <Form>
          <Form.Group id="message">
            <Form.Control className="mb-3" type="text" required />
          </Form.Group>
          <Button type="submit" className='w-100 mt-3'>
            Send
          </Button>
        </Form>
      </div>
    </>
  )
}
