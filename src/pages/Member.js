import { H3,H1 } from "../components/constant";
import { useState, useRef, useContext, useEffect } from "react";
import AuthContext from "../store/AuthContext";
import { signIn, signUp, logOut, useAuth } from "../store/AuthFirebase";
import { saveSignUpdData } from "../store/HandleDb";
import { Button,Text } from "../components/constant";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useTransition } from "react";


const MemberDiv=styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  max-width: 512px;
  margin: 0px auto 28px auto;
  padding: 62.12px 99px 48px;
  width: 314px;
  box-shadow: 0px 4px 24px rgb(0 0 0 / 10%);
`
const MemberInputDiv=styled.div`
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;
  justify-content: center;
  align-items: center;
  width: 400px;
  border-radius: 6px;
`
const InputDiv=styled.input`
  width: 90%;
  box-sizing: border-box;
  outline: none;
  margin:10px 0;
  padding:15px;
  border:1px solid #CCCCCC;
  background: #FFFFFF;
  border-radius: 5px;
  font-size: 14px;
`
const BtnDiv=styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
`

const SignUpBtn=styled(Button)`
  margin:5px 0 20px 0;
  width: 100%;
  background:#FBBC04 ;
  border-radius: 10%;
  display:${props=> props.isSignUp==true? "block": "none"};
`
const LoginBtn=styled(Button)`
  margin:5px 0 20px 0;
  width: 100%;
  background:#FBBC04 ;
  border-radius: 10%;
  display: ${props=> props.isSignUp==true? "none": "block"};
`
const Plink=styled(Text)`
  pointer-events:unset ;
  text-decoration: underline;
    &:hover{
      cursor:pointer;
      color: #FBBC04;
      text-decoration: underline;
    }
`

const Member = () => {
  const {
    getSignIn,
    isAuthented,
    getSignUp,
    getLogOut,
    getErrorMessage,
    error,
  } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [isSignUp,setIsSignUp]=useState(false);
  const navigation=useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const currentUser = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    try {
      let response = await signIn(
        emailRef.current.value,
        passwordRef.current.value
      );
      let user = {
        email: response["user"]["email"],
        token: response["user"]["accessToken"],
        uid: response["user"]["uid"],
      };
      getSignIn(user); //回呼disAutoPatch;
      localStorage.setItem("token",JSON.stringify(user));//存入uid到local storage
      navigation("/", { replace: true });
    } catch (error) {
      let errorMessage = error.code;
      getErrorMessage(errorMessage);
    }
    setLoading(false);
  };

  const handleSignUp = async () => {
    setLoading(true);
    try {
      let response = await signUp(
        emailRef.current.value,
        passwordRef.current.value
      );
      let user = {
        email: response["user"]["email"],
        token: response["user"]["accessToken"],
        uid: response["user"]["uid"],
      };
      await saveSignUpdData(user);
      getSignUp(user);
      localStorage.setItem("token",response["user"]["uid"]);//存入uid到local storage
    } catch (error) {
      let errorMessage = error.code;
      getErrorMessage(errorMessage);
    }
    setLoading(false);
  };

  // useEffect(()=>{
    
  // },[isSignUp])

  return (
    <>
      <MemberDiv>
      <H1> KeepNote </H1>
      <MemberInputDiv>
      <H3>{isSignUp?"註冊" :"登入"} {currentUser ? currentUser.email : null}</H3>
      <InputDiv type="email" placeholder="輸入帳號" ref={emailRef} />
      <InputDiv type="password" placeholder="輸入密碼" ref={passwordRef} />
      {/* 顯示錯誤文字 */}
      {error ? <Text>{error}</Text> : null}
      <BtnDiv>
      <SignUpBtn isSignUp={isSignUp} disabled={loading} onClick={handleSignUp}>
        註冊
      </SignUpBtn>
      <LoginBtn isSignUp={isSignUp} disabled={loading} onClick={handleLogin }>
        登入
      </LoginBtn>
      {isSignUp
      ?<Plink  onClick={(e)=> {e.preventDefault();setIsSignUp(false);}}> 已有帳號？點此登入</Plink> 
      :<Plink  onClick={(e)=> {e.preventDefault();setIsSignUp(true);}}> 沒有帳戶？請點此註冊帳號</Plink>
      }
      </BtnDiv>
      </MemberInputDiv>
      </MemberDiv>
    </>
  );
};

export default Member;
