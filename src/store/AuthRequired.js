import { useAuth } from "./AuthState";
import { Outlet,Navigate } from "react-router-dom";

const AuthRequired =()=>{
    const isLoggin=JSON.parse(localStorage.getItem("token")) 
    // const auth= useAuth();
    // const isAuth=auth.isAuthented
    console.log(isLoggin);
    return isLoggin? <Outlet /> : <Navigate to="/" />

}

export default AuthRequired