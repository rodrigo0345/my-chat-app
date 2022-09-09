import React, {useState} from 'react'
import { Card, Button, Alert } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { PrivateRoute } from './PrivateRoute'

export default function Dashboard() {
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
        <Card>
            <Card.Body>
                <h2 className="text-center mb-4">Profile</h2>
                {error && <Alert className="alert alert-danger">{error}</Alert>}
                <strong>Email: {currentUser && currentUser.email}</strong>
                <Link to="/update-profile" className="btn btn-primary w-100 mt-3">
                    Update Profile
                </Link>
            </Card.Body>

        </Card>
        <div className="w-100 text-center mt-2">
            <Button variant="link" onClick={handleLogout}>Log Out</Button>
        </div>
    </>
  )
}
