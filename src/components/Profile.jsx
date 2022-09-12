import React, {useState} from 'react'
import { Card, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import styled from 'styled-components';


const CardStyled = styled(Card)`
    max-width: 600px;
    width: 60%;
    @media (max-width: 620px) {
        width: 90%;
    }
`

export default function Profile() {
    const { currentUser, logout } = useAuth();
    const [error, setError] = useState("");
    const navigate = useNavigate();

    async function handleLogout() {
        
        try{
            setError('');
            await logout();
            navigate('/login');
        }
        catch(error){
            setError("Failed to log out");
            console.warn(error);
        }
    }

  return (
    <>
        <div className="card">
            <h2 className="text-center mb-4">Profile</h2>
            {error && <Alert className="alert alert-danger">{error}</Alert>}
            <img src={currentUser?.photoURL? currentUser.photoURL: "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"} alt="" style={{margin: "auto", border: "1px solid black", borderRadius: "50%", padding: "0.4em"}} height="150" width="150"/>
            <br />
            <strong>Username: {currentUser && currentUser.displayName}</strong>
            <br />
            <div className="form-control">
                <label>Email: {currentUser && currentUser.email}</label>
            </div>
            
            <Link to="/">
                Home
            </Link>
            <Link to="/update-profile">
                Update Profile
            </Link>
        </div>
        <div className="w-100 text-center mt-2">
            <Button variant="link" onClick={handleLogout}>Log Out</Button>
        </div>
    </>
  )
}
