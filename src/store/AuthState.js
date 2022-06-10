import { useContext,useReducer} from "react";
import AuthContext  from "./AuthContext";
import {AuthReducer,mapAuthCodeToMessage} from "./AuthReducer";



const AuthState=(props)=>{
    const initial={
        user:null,
        isAuthented:false,
    }
    const errorMes={
        error:null
    }
    const[authstate,disAuthPatch] = useReducer(AuthReducer,initial);
    const[error,disErrorPatch]=useReducer(mapAuthCodeToMessage,errorMes);
    //Login
    const getSignIn=(user)=>{
        disAuthPatch({
            type:"LOGIN",
            payload:user
        })
    }
    //註冊
    const getSignUp=(user)=>{
        disAuthPatch({
            type:"SIGNUP",
            payload:user
        })
    }
    //登出
    const getLogOut=()=>{
        disAuthPatch({
            type:"SIGNUP",
        })
    }
    //重設密碼 
    const getResetPassword=(email)=>{
        disAuthPatch({
            type:"RESET",
            payload:email
        })
    }
    //取得erroMessage
    const getErrorMessage=(errorCode)=>{
        disErrorPatch({type:errorCode})
    }
    return(
        <AuthContext.Provider value={{user:authstate.user,isAuthented:authstate.isAuthented,error:error.error,getSignIn,getSignUp,getLogOut,getErrorMessage,getResetPassword,reset:authstate.reset}} >
            {props.children}
        </AuthContext.Provider>
        )
    }
export default AuthState;

// export const useAuth=()=>{//把AuthContext包成function使用
//     return useContext(AuthContext)
// }