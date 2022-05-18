import { useContext,useState } from "react";
import AuthContext from "../store/AuthContext";
import { logOutUser } from "../store/AuthFirebase";
import { BgRoundDiv } from "../components/constant";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

// const LogoutButton=styled.div`
//     width: 50px;
//     height: 50px;
//     line-height: 50px;
//     text-align: center;
//     transition: all ease-in-out .3s;
//     &:hover{
//         border-radius: 50%;
//         background:rgba(99,99,104,0.157);
//         cursor: pointer;
//     }
// `

const LogOut=()=>{
    const{getLogOut}=useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const navigation=useNavigate()
    const handleLogout = async () => {
        setLoading(true);
        try {
          getLogOut();
          localStorage.removeItem("token");//移除uid local storage
           await logOutUser();
          navigation("/");
          setTimeout(()=>{
            window.location.reload();
           },500)
           console.log('reload page');
        } catch (e) {
          console.log(e);
        }
        setLoading(false);
      };

    return(
        <BgRoundDiv  disabled={loading} onClick={handleLogout}>
        登出
      </BgRoundDiv>

    )

}

export default LogOut