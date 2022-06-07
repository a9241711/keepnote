import { auth} from "./firebase";
import {reauthenticateWithCredential,EmailAuthProvider,createUserWithEmailAndPassword,onAuthStateChanged,signInWithEmailAndPassword,sendPasswordResetEmail, signOut,signInWithPopup, GoogleAuthProvider,updatePassword} from "firebase/auth"
import { useEffect, useState } from "react";

const provider = new GoogleAuthProvider();


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
//更新密碼
export async function  changePassword(oldPassword,password,setErrorPassword){
    const user = auth.currentUser;
    let credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        oldPassword
      );
    reauthenticateWithCredential(user, credential)
    .then( async(result) => {
        console.log("result",result)
        const res=await updatePassword(user, password);
        if(typeof res ==="undefined"){
            return setErrorPassword("密碼修改成功");
        }
        console.log("res",res)
    }).catch((error) => {
        console.log("error",error.code);
        if(error.code==="auth/weak-password"){
            return setErrorPassword("新密碼須至少包含6個字元");
        }
        return setErrorPassword("舊密碼錯誤，請輸入正確密碼以變更密碼");
      });
}

export function useAuth(){
    const[currentUser,setCurrentUser]=useState();
    useEffect(()=>{
    let unsub=onAuthStateChanged(auth, user=> setCurrentUser(user));
    return unsub
    },[])
    return currentUser;
}

//Google SignIn
export function signInGoogle(){
    return signInWithPopup(auth,provider) 

}
