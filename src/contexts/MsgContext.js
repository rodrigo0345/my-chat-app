import React from 'react'
import { setDoc, collection, doc, onSnapshot } from "firebase/firestore";
import { db } from '../firebase';

const MsgContext = React.createContext();

export function useMsg(){
    return React.useContext(MsgContext);
}

export default function MsgProvider({ children }) {

    const [ loading, setLoading ] = React.useState(true);
    const [ messages, setMessages ] = React.useState([]);

    const colRef = collection(db, "chat");

    function getMessages(){
        return messages;
    }

    function sendMessage(userID, chatID, message){
        return setDoc(doc(colRef, chatID), {
            userID: userID,
            chatID: chatID,
            message: message,
        })
    }

    const value = {
        getMessages,
        sendMessage,
    };

    React.useEffect(() => {
        const colChat = collection(db, "chat");
        const unsubscribe = onSnapshot(doc(db, "chat", "geral"),
            (querySnapshot) => {
                const docs = [];
                querySnapshot.forEach((doc) => {
                    docs.push({ ...doc.data(), id: doc.id });
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
