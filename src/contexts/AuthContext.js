import React, { useEffect } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'

const AuthContext = React.createContext();

export function useAuth(){
    return React.useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = React.useState();
    const [loading, setLoading] = React.useState(true);

    function signup(email, password){
        return createUserWithEmailAndPassword(auth, email, password);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
            setLoading(false);
        })

        return unsubscribe;
    }, []);
    

    const value = {
        currentUser,
        signup
    }
    return (
        <AuthContext.Provider value={value}>
            { !loading && children }
        </AuthContext.Provider>
    )
}
