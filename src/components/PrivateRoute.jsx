import React from 'react'
import { Route, Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function PrivateRoute({ children }) {
    const { currentUser } = useAuth();
    const [newUser, setNewUser] = React.useState(false);

    React.useEffect(() => {
        setNewUser(currentUser?.displayName? false : true);
    }, [currentUser])
    

    return newUser? children: (currentUser? children: <Navigate to="/login" />)
}
