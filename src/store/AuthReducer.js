
export const AuthReducer=(state,action)=>{
    switch(action.type){
        case "LOGIN":
            console.log("action",action.payload)
            return {user:action.payload,isAuthented:true}
        case "LOGOUT":
            console.log("action")
            return {user:null,isAuthented:false}
        case "SIGNUP":
            console.log("action")
            return {user:action.payload,isAuthented:true}
        case "Error":
            return {}
        default:
            return state
    }
}


export const mapAuthCodeToMessage=(state,action)=>{
    console.log(action.type);
    switch(action.type){
        case "auth/wrong-password":
            return {error:"帳號密碼錯誤，請重新輸入"}
        case "auth/invalid-password":
            return {error:"密碼至少須包含6個數字或字母"}
        case "auth/invalid-email":
            return {error:"帳號格式有誤，必須是email格式"}
        case "auth/email-already-in-use":
            return {error:"帳號已被使用，請重新註冊"}
        case "auth/weak-password":
            return {error:"weak-password"}
        default:
            return state
    }
}
