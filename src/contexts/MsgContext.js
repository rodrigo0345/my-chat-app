import React from 'react'
import { setDoc, collection, doc, onSnapshot, query, startAfter } from "firebase/firestore";
import { db } from '../firebase';
import uniqid from 'uniqid';
import { Timestamp, orderBy, limit, getDocs } from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from '../firebase'

const MsgContext = React.createContext();

export function useMsg(){
    return React.useContext(MsgContext);
}

export default function MsgProvider({ children }) {

    const [ loading, setLoading ] = React.useState(true);
    const [ messages, setMessages ] = React.useState([]);
    const [ chats, setChats ] = React.useState([]);
    const [ lastRef, setLastRef ] = React.useState(null);
    // used for later
    const [ currentChat, setCurrentChat ] = React.useState('geral');

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

    async function fetchMoreMessages(chatID){
        const colChat = collection(db, chatID);
        let q = undefined;
        if (lastRef === undefined) { 
            q =  query( 
                colChat,
                orderBy("timestamp", "desc"),
                limit(10),
            ); 
        }
        else {
            q =  query( 
                colChat,
                limit(10),
                orderBy("timestamp", "desc"),
                startAfter(lastRef.data().timestamp),
            );
        }

        let snapshot;
        try{
            snapshot = await getDocs(q);
            const docs = snapshot.docs.map(doc => doc.data());
            setMessages(prev => [...prev, ...docs]);
        }
        catch(err){
            console.warn(err);
            throw err;
        }

        setLastRef(snapshot.docs[snapshot.docs.length - 1]);
    }

    function addChat(id, name, users, photoURL){
        const ref = collection(db, "savedChats");
        return setDoc(doc(ref, id), {
            chatID: id,
            name: name,
            users: users,
            photoURL: photoURL,
        });
    }

    const value = {
        messages,
        sendMessage,
        notificationsAllowed,
        savePhotoOnServer,
        chats,
        currentChat,
        setCurrentChat,
        addChat, 
        fetchMoreMessages
    };

    // update messages
    React.useEffect(() => {
        setLoading(true);

        // redundant but the msgRef does not update immidiatly
        const ref = collection(db, currentChat);
        const q = query(ref, orderBy("timestamp", "desc"), limit(10));

        // get all the latest messages
        const unsubscribe = onSnapshot(q,
            (querySnapshot) => {
                const docs = [];
                querySnapshot.docs.forEach((doc) => {
                    docs.push({ ...doc.data() });
                });
                setMessages(docs);
                setLoading(false);
                setLastRef(querySnapshot.docs[querySnapshot.docs.length - 1]);
            }
        );

        return unsubscribe; 
    }, [currentChat]);

    // update chats
    React.useEffect(() => {
        setLoading(true);

        const colChat = collection(db, "savedChats");

        // get all the chats
        const unsubscribe = onSnapshot(colChat,
            (querySnapshot) => {
                const docs = [];
                querySnapshot.docs.forEach((doc) => {
                    docs.push({ ...doc.data() });
                });
                setChats(docs);
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
