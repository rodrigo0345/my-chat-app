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
import { setDoc, doc, getDoc, collection, getDocs, where, query, limit} from 'firebase/firestore';

const AuthContext = React.createContext();

export function useAuth(){
    return React.useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = React.useState();
    const [loading, setLoading] = React.useState(true);

    async function registerUserDataInDatabase(name, email, userID){

        const fileRef = ref(storage, `images/${userID}/avatar`);
        const avatarUrl = await getDownloadURL(fileRef);

        return setDoc(doc(db, "users", userID),{
            displayName: name,
            email: email,
            photoURL: avatarUrl,
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

    async function updateEmailAndUsername(email, username){
        try{
            await updateProfile(currentUser, { displayName: username, email: email });
        }
        catch(err){
            console.warn(err);
            throw(err);
        }
    }

    function searchUser(id){
        const colUserRef = collection(db, "users");
        const userRef = doc(colUserRef, id);
        return getDoc(userRef);
    }

    function retrieveUsers(name=""){
        const colRef = collection(db, "users");
        const q = query(colRef, where("displayName", "==", name), limit(6)); 
        return getDocs(q);
    } 

    function retrieveAllUsers(){
        const colRef = collection(db, "users");
        return getDocs(colRef);
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
        updateEmailAndUsername,
        searchUser, 
        retrieveUsers,
        retrieveAllUsers,
    }
    return (
        <AuthContext.Provider value={value}>
            { !loading && children }
        </AuthContext.Provider>
    )
}
