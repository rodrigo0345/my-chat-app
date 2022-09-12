import React, {useRef, useState} from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'
import styled from 'styled-components';
import '../styles/Login.css';

export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { currentUser, login } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();

        try{
            setError('');
            setLoading(true);
            await login(emailRef.current.value, passwordRef.current.value);
            currentUser.displayName? navigate('/'): navigate('/new-user');
        }
        catch{
            setError("Failed to log in");
        }

        setLoading(false);
    }

    return (
    <>
        <div className="card">
            <h1>Login</h1>
            {error && <Alert variant="danger">{error}</Alert>}
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Email</label>
                    <input type="email" ref={emailRef} required className="form-control" />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input type="password" ref={passwordRef} required className="form-control" />
                </div>
                <button disabled={loading} className="submit" type="submit">Log </button>
            </form>
            <div className="forgot-password">
                <Link to="/forgot-password">Forgot Password?</Link>
            </div>
        </div>
        <div className="w-100 text-center mt-2" style={{color: "white"}}>
            Need an account? <Link to="/signup">Sign Up</Link>
        </div>
    </>
    )
}
