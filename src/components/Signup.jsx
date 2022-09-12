import React, {useRef, useState} from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom';

export default function Signup() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { signup } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        if(passwordConfirmRef.current.value !== passwordRef.current.value) {
            return setError("Passwords do not match");
        }

        try{
            setError('');
            setLoading(true);
            await signup(emailRef.current.value, passwordRef.current.value);
            navigate('/new-user');
        }
        catch{
            setError("Failed to create an account");
        }

        setLoading(false);
        
    }

    return (
    <>
        <div className="card">
            <h1>Sign Up</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            { loading && <div className="loading-wrap">
                <div className="loading" /> 
            </div> }
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" ref={emailRef} required className="form-control" />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" ref={passwordRef} required className="form-control" />
                </div>
                <div className="form-group">
                    <label>Password Confirmation</label>
                    <input type="password" ref={passwordConfirmRef} required className="form-control" />
                </div>
                <button disabled={loading} className="submit" type="submit">Sign Up</button>
            </form>
        </div>
        <div className="w-100 text-center mt-2" style={{color: "white"}}>
            Already have an account? <Link to="/login">Log In</Link>
        </div>
    </>
    )
}
