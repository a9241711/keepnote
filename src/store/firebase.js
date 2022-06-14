
import { initializeApp } from "firebase/app";
import { getFirestore} from "firebase/firestore";
import {getAuth} from "firebase/auth";


//  web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCWPZxWnposbvVw0WH_SUD7pqVEIueob-M",
    authDomain: "keepproject-e7d2b.firebaseapp.com",
    projectId: "keepproject-e7d2b",
    storageBucket: "keepproject-e7d2b.appspot.com",
    messagingSenderId: "985196186017",
    appId: "1:985196186017:web:ceb9af7979df44ec48a3e0",
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db= getFirestore(app);
// export  const db =getDatabase(app);
export const auth=getAuth();
