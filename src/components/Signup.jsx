import React, {useRef} from 'react'
import { Form, Button, Card } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'

export default function Signup() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup } = useAuth();

    function handleSubmit(e) {
        e.preventDefault();

        signup(emailRef.current.value, passwordRef.current.value)
    }

    return (
    <>
        <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Sign Up</h2>
                <Form>
                    <Form.Group id="email">
                        <Form.Label className="mt-3">Email</Form.Label>
                        <Form.Control ref={emailRef}type="email" required />
                    </Form.Group>
                    <Form.Group id="password">
                        <Form.Label className="mt-3">Password</Form.Label>
                        <Form.Control ref={passwordRef} type="password" required />
                    </Form.Group>
                    <Form.Group id="password-confirm">
                        <Form.Label className="mt-3">Password Confirmation</Form.Label>
                        <Form.Control ref={passwordConfirmRef} type="password" required />
                    </Form.Group>
                    <Button type="submit" className='w-100 mt-3'>
                        Sign Up
                    </Button>
                </Form>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
            Already have an account? Log In
        </div>
    </>
    )
}
