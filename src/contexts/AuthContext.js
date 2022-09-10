import React, { useEffect } from 'react'
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    sendPasswordResetEmail, 
    updateProfile,
 } from 'firebase/auth';
import { auth, storage } from '../firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db } from '../firebase';
import { setDoc, doc} from 'firebase/firestore';

const AuthContext = React.createContext();

export function useAuth(){
    return React.useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = React.useState();
    const [loading, setLoading] = React.useState(true);

    function registerUserDataInDatabase(photo, name, email, userID){
        return setDoc(doc(db, "users", userID),{
            displayName: name,
            email: email,
            photoURL: photo,
        })
    }

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
        const fileRef = ref(storage, `images/${currentUser.uid}/avatar`);

        try{
            await uploadBytes(fileRef, avatar);
            const avatarUrl = await getDownloadURL(fileRef);
            await updateProfile(currentUser, { displayName: username, photoURL: avatarUrl, email: email });
        }catch(err){
            console.warn(err);
        }
    }

    function searchUser(id){
        return db.collection("users").doc(id).get();
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
        registerUserDataInDatabase,
        signup,
        login,
        logout,
        resetPassword,
        updateEmail,
        updateUserInfo,
        searchUser
    }
    return (
        <AuthContext.Provider value={value}>
            { !loading && children }
        </AuthContext.Provider>
    )
}
