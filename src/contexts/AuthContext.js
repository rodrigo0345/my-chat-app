import React, { useEffect } from 'react'
import { auth } from '../firebase'

const AuthContext = React.createContext();

export function useAuth(){
    return React.useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = React.useState();

    function signup(email, password){
        return auth.signInWithEmailAndPassword(email, password);
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
        })

        return unsubscribe;
    }, []);
    

    const value = {
        currentUser,
        signup
    }
    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}
