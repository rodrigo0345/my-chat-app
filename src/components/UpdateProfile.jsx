import React, {useRef, useState} from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom';

export default function UpdateProfile() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { currentUser, updateEmail, updatePassword } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    function handleSubmit(e) {
        e.preventDefault();

        if(passwordConfirmRef.current.value !== passwordRef.current.value) {
            return setError("Passwords do not match");
        }

        const promises = [];
        if(emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value));
        }
        if(passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value));
        }

        setLoading(true);
        setError('');

        Promise.all(promises).then(() => {
            navigate('/');
        }).catch((error) => {
            setError("Failed to update account");
            console.warn(error);
        }).finally(() => {
            setLoading(false);
        });

        setLoading(false);
    }

    return (
    <>
        <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Update Profile</h2>
                {error && <Alert className="alert alert-danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="email">
                        <Form.Label className="mt-3">Email</Form.Label>
                        <Form.Control defaultValue={currentUser.email} ref={emailRef}type="email" required />
                    </Form.Group>
                    <Form.Group id="password">
                        <Form.Label className="mt-3"
                        >Password</Form.Label>
                        <Form.Control placeholder='Leave blank to keep the same'
                        ref={passwordRef} type="password"/>
                    </Form.Group>
                    <Form.Group id="password-confirm">
                        <Form.Label className="mt-3">Password Confirmation</Form.Label>
                        <Form.Control
                        placeholder='Leave blank to keep the same' 
                        ref={passwordConfirmRef} type="password"/>
                    </Form.Group>
                    <Button type="submit" className='w-100 mt-3'
                    disabled={loading}>
                        Update
                    </Button>
                </Form>
            </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
        <Link to="/">Cancel</Link>
        </div>
    </>
    )
}
