import React, {useRef, useState} from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try{
            setError('');
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            navigate('/');
        }
        catch{
            setError("Failed to log in");
        }

        setLoading(false);
    }

    return (
    <>
        <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Log In</h2>
                {error && <Alert className="alert alert-danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="email">
                        <Form.Label className="mt-3">Email</Form.Label>
                        <Form.Control ref={emailRef}type="email" required />
                    </Form.Group>
                    <Form.Group id="password">
                        <Form.Label className="mt-3">Password</Form.Label>
                        <Form.Control ref={passwordRef} type="password" required />
                    </Form.Group>
                    <Button type="submit" className='w-100 mt-3'
                    disabled={loading}>
                        Log In
                    </Button>
                </Form>
                <div className="w-100 text-center mt-3">
                    <Link to="/forgot-password">Forgot Password?</Link>
                </div>

            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
            Need an account? <Link to="/signup">Sign Up</Link>
        </div>
    </>
    )
}
