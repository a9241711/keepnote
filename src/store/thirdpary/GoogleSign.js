import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Text } from "../../components/constant";
import { Google } from "../../assets";
import AuthContext from "../AuthContext";
import { signInGoogle } from "../AuthFirebase";
import { saveSignUpdData } from "../handledb/MemberDb";


const GoogleDiv=styled.div`
    width: 45%;
    height: 40px;
    border: 1px solid #565656;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 8px;
    margin-bottom: 10px;
    &:hover{
        cursor: pointer;
    }
`
const GoogleImg=styled.div`
    width: 32px;
    height: 32px;
    background-image: url(${Google}) ;
    background-position: center;
    margin-right: 5px;
`

const GoogleSign=()=>{
    const {
        getSignIn,
        getErrorMessage,
      } = useContext(AuthContext);
      const navigation=useNavigate();
    const handleGoogle= async()=>{
        try {
          let response = await signInGoogle();
          let user = {
            email: response["user"]["email"],
            token: response["user"]["accessToken"],
            uid: response["user"]["uid"],
            providerId:response["user"]["providerData"][0]["providerId"]
          };
          await saveSignUpdData(user);//存入DB
          getSignIn(user);////回呼disAutoPatch
          localStorage.setItem("token",JSON.stringify(user));//存入uid到local storage
          navigation("/login", { replace: true });
        } catch (error) {
          let errorMessage = error.code;
          getErrorMessage(errorMessage);
        }
    }

    return(
        <>
        <GoogleDiv onClick={handleGoogle}>
            <GoogleImg></GoogleImg>
            <Text>Google 登入</Text>
        </GoogleDiv>
        </>
    )
}

export default GoogleSign