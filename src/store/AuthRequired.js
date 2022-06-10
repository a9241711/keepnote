import { Outlet,Navigate } from "react-router-dom";

const AuthRequired =()=>{
    const isLoggin=JSON.parse(localStorage.getItem("token")); 
    return isLoggin? <Outlet /> : <Navigate to="/" />
}
export default AuthRequired