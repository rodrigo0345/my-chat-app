import React, {useRef, useState} from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom';

export default function UpdateProfile() {
    const emailRef = useRef();
    const usernameRef = useRef();
    const imageRef = useRef();
    const { currentUser, registerUserDataInDatabase, updateEmailAndUsername } = useAuth();
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
        
        imageRef.current.files[0]?
        image = imageRef.current.files[0]:
        image = currentUser.photoURL;

        try{
            setLoading(true);
            setError('');

            imageRef.current.files[0]? 
            await updateUserInfo(email, username, image):
            await updateEmailAndUsername(email, username);
            await registerUserDataInDatabase(username, email, currentUser.uid);

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
        <div className="card">
            <h2>Update Profile</h2>
            {error && <Alert className="alert alert-danger">{error}</Alert>}
            <form onSubmit={handleSubmit}>
                <div className="form-group" id="id">
                    <label className="mt-3">Photo</label>
                    <Form.Control ref={imageRef} type="image" height='100'
                    style={{width: '100px', margin: 'auto'}}
                    src={currentUser.photoURL? currentUser.photoURL : "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"}
                    />
                    <Form.Control ref={imageRef} type="file"
                    className='mt-3'
                    />
                </div>
                <div className="form-group" id="username">
                    <Form.Label className="mt-3">Username</Form.Label>
                    <Form.Control ref={usernameRef} type="text" maxLength={20} 
                    defaultValue={currentUser.displayName? currentUser.displayName: ''} 
                    placeholder='Enter a new username'
                    />
                </div>
                <div className="form-group" id="email">
                    <Form.Label className="mt-3">Email</Form.Label>
                    <Form.Control defaultValue={currentUser.email} ref={emailRef}type="email" required />
                </div>
                <button type="submit" className='w-100 mt-3'
                disabled={loading}>
                    Update
                </button>
            </form>
        </div>
        <div className="w-100 text-center mt-2">
        <Link to="/">Cancel</Link>
        </div>
    </>
    )
}
