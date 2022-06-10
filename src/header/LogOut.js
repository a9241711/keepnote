import { useContext,useState } from "react";
import AuthContext from "../store/AuthContext";
import { logOutUser } from "../store/AuthFirebase";
import { BgRoundDiv } from "../components/constant";
import { useNavigate } from "react-router-dom";



const LogOut=()=>{//登出按鈕
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