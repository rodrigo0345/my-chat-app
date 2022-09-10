import React, {useRef, useState} from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom';

export default function UpdateProfile() {
    const emailRef = useRef();
    const usernameRef = useRef();
    const imageRef = useRef();
    const { currentUser, registerUserDataInDatabase } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { updateUserInfo } = useAuth();

    async function handleSubmit(e) {
        e.preventDefault();

        let email, username, image;

        emailRef.current.value !== currentUser.email?
            email = emailRef.current.value:
            email = currentUser.email;
        
        usernameRef.current?.value?
            username = usernameRef.current.value:
            username = currentUser.username;
        
        imageRef.current?.value?
            image = imageRef.current.files[0]:
            image = currentUser.photoURL;

        try{
            setLoading(true);
            setError('');
            await updateUserInfo(email, username, image);
            await registerUserDataInDatabase(JSON.stringify(image), username, email, currentUser.uid);
            navigate('/');
        } catch(error) {
            setError("Failed to update account");
            console.warn(error);
        }

        setLoading(false);
    }

    function handleChange(e){
        // filter better this shit
    }

    return (
    <>
        <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Update Profile</h2>
                {error && <Alert className="alert alert-danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group id="photo">
                        <Form.Label className="mt-3">Photo</Form.Label>
                        <Form.Control ref={imageRef} type="image" height='100'
                        style={{width: '100px', margin: 'auto'}}
                        src={currentUser.photoURL? currentUser.photoURL : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                        />
                        <Form.Control ref={imageRef} type="file"
                        className='mt-3'
                        />
                    </Form.Group>
                    <Form.Group id="username">
                        <Form.Label className="mt-3">Username</Form.Label>
                        <Form.Control ref={usernameRef} type="text" maxLength={20} 
                        defaultValue={currentUser.displayName? currentUser.displayName: ''} 
                        placeholder='Enter a new username'
                        />
                    </Form.Group>
                    <Form.Group id="email">
                        <Form.Label className="mt-3">Email</Form.Label>
                        <Form.Control defaultValue={currentUser.email} ref={emailRef}type="email" required />
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
