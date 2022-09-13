import React from 'react'
import { setDoc, collection, doc, onSnapshot, query } from "firebase/firestore";
import { db } from '../firebase';
import uniqid from 'uniqid';
import { Timestamp, orderBy, limit } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase'

const MsgContext = React.createContext();

export function useMsg(){
    return React.useContext(MsgContext);
}

export default function MsgProvider({ children }) {

    const [ loading, setLoading ] = React.useState(true);
    const [ messages, setMessages ] = React.useState([]);

    // used for later
    const [ currentChat, setCurrentChat ] = React.useState(null);

    const colRef = collection(db, "chat");

    function sendMessage(userID, chatID="geral", message, type="text"){
        const colRefChat = collection(db, chatID);
        return setDoc(doc(colRefChat, uniqid()), {
            userID: userID,
            message: message,
            timestamp: Timestamp.now(),
            type: type
        });
    }

    async function savePhotoOnServer(userID, chatID, file){
        const fileRef = ref(storage, `images/${chatID}/${userID}/${uniqid()}`);
        
        let fileUrl;
        try{
            await uploadBytes(fileRef, file);
            fileUrl = await getDownloadURL(fileRef);
        }catch(err){
            console.warn(err);
            return err;
        }
        return fileUrl;
    }

    async function notificationsAllowed(){
        const notify =  await Notification.requestPermission();

        let granted = false ;
        if(notify === "granted"){
            granted = true;
        }

        return granted;
    }

    const value = {
        messages,
        sendMessage,
        notificationsAllowed,
        savePhotoOnServer,
    };

    React.useEffect(() => {
        // get the current chat
        const colChat = collection(db, "geral");

        const q = query(colChat, orderBy("timestamp", "desc"), limit(10));

        // get all the latest messages
        const unsubscribe = onSnapshot(q,
            (querySnapshot) => {
                const docs = [];
                querySnapshot.docs.forEach((doc) => {
                    docs.push({ ...doc.data() });
                });
                setMessages(docs);
                setLoading(false);
            }
        );

        return unsubscribe; 
    }, []);

  return (
    <MsgContext.Provider value={value}>
        {!loading && children}
    </MsgContext.Provider>
  )
}
