import React, { useEffect } from 'react'
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    sendPasswordResetEmail, 
    updateEmail, 
    updatePassword, 
    updateProfile } from 'firebase/auth';
import { auth, storage } from '../firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

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

    function login(email, password){
        return signInWithEmailAndPassword(auth, email, password);
    }

    function logout(){
        return signOut(auth);
    }

    function resetPassword(email){
        return sendPasswordResetEmail(auth, email);
    }

    function updateEmail(email){
        return updateEmail(currentUser, email);
    }

    async function updateUserInfo(email, username, avatar){
        const fileRef = ref(storage, `images/${currentUser.uid}/avatar.webp`);

        const metadata = {
            contentType: 'image/webp',
        };

        try{
            await uploadBytes(fileRef, avatar, metadata);
            const avatarUrl = await getDownloadURL(fileRef);
            await updateProfile(currentUser, { displayName: username, photoURL: avatarUrl, email: email });
        }catch(err){
            console.warn(err);
        }
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
        signup,
        login,
        logout,
        resetPassword,
        updateEmail,
        updateUserInfo
    }
    return (
        <AuthContext.Provider value={value}>
            { !loading && children }
        </AuthContext.Provider>
    )
}
