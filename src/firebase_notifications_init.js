import { messaging } from "./firebase";
import { getToken } from "firebase/messaging";

const requestForToken = () => {
    getToken(messaging, { vapidKey: 'BPPGWdIzWyqMUttpd_IagqRDNt2bPsthLLAbbNIrlhsVFNiZSRALjCqBaxSgfnUgYTeT7SMcoCQxaJYTzTR8eCk' })
      .then((currentToken) => {
        if (currentToken) {
          console.log('current token for client: ', currentToken);
        } else {
            
            console.log('No registration token available. Request permission to generate one.');
        }
      })
      .catch((err) => {
        console.warn('An error occurred while retrieving token. ', err);
      });
  };
export const requestForPermission = () => {
    Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
            console.log('Notification permission granted.');
            requestForToken();
        } else {
            Notification.requestPermission();
            console.log('Unable to get permission to notify.');
        }
    });
};