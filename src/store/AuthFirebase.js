import { auth} from "./firebase";
import {createUserWithEmailAndPassword,onAuthStateChanged,signInWithEmailAndPassword,sendPasswordResetEmail, signOut} from "firebase/auth"
import { useEffect, useState } from "react";

export function signIn(email,password){
    return signInWithEmailAndPassword(auth,email,password)
}

export function signUp(email,password){
    return createUserWithEmailAndPassword(auth,email,password);
}


export function logOutUser(){
    return signOut(auth);
}
//忘記密碼
export function resetPassword(email){
    return sendPasswordResetEmail(auth,email);
}

export function useAuth(){
    const[currentUser,setCurrentUser]=useState();
    useEffect(()=>{
    let unsub=onAuthStateChanged(auth, user=> setCurrentUser(user));
    return unsub
    },[])
    return currentUser;
}

