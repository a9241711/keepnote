import { auth} from "./firebase";
import {createUserWithEmailAndPassword,onAuthStateChanged,signInWithEmailAndPassword, signOut} from "firebase/auth"
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

export function useAuth(){
    const[currentUser,setCurrentUser]=useState();
    useEffect(()=>{
    let unsub=onAuthStateChanged(auth, user=> setCurrentUser(user));
    return unsub
    },[])
    return currentUser;
}