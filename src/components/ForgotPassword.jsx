import React, {useRef, useState} from 'react'
import { Form, Button, Card, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'
import 'bootstrap/dist/css/bootstrap.min.css';

export default function ForgotPassword() {
    const emailRef = useRef();
    const { resetPassword } = useAuth();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    async function handleSubmit(e) {
        e.preventDefault();

        try{
            setMessage('');
            setError('');
            setLoading(true);
            await resetPassword(emailRef.current.value);
            setMessage("Check your inbox or spam inbox for further instructions");
        }
        catch{
            setError("Failed to send password reset email");
        }

        setLoading(false);
    }

    return (
    <>
        <div className="card">
                <h2 className="text-center mb-4">Password Reset</h2>
                {message && <Alert className="alert alert-success">{message}</Alert>}
                {error && <Alert className="alert alert-danger">{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group" id="email">
                        <label className="mt-3">Email</label>
                        <input ref={emailRef}type="email" required />
                    </div>
                    <button type="submit"
                    disabled={loading}>
                        Reset Password
                    </button>
                </form>
                <div className="w-100 text-center mt-3">
                    <Link to="/login">Log In</Link>
                </div>
        </div>
        <div className="w-100 text-center mt-2" style={{color: "white"}}>
            Need an account? <Link to="/signup">Sign Up</Link>
        </div>
    </>
    )
}
