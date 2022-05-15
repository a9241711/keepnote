import { H3,H1 } from "../components/constant";
import { useState, useRef, useContext, useEffect } from "react";
import AuthContext from "../store/AuthContext";
import { signIn, signUp, logOut, useAuth,resetPassword } from "../store/AuthFirebase";
import { saveSignUpdData } from "../store/HandleDb";
import { Button,Text } from "../components/constant";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { async } from "@firebase/util";


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
  width: 100%;
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
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 10px 0;
`

const SignUpBtn=styled(Button)`
  margin:5px 0 20px 0;
  width: 45%;
  border-radius: 8px;
  height: 40px;
  background: #FBBC04;
  border-radius: 8px;
  margin-top: 0;
  display:${props=> props.isSignUp==true? "block": "none"};
  &:hover{
    border: 1px solid #FBBC04 ;
    background-color: #FFFFFF;
  }
`
const LoginBtn=styled(SignUpBtn)`
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
    error,getResetPassword,reset
  } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);//防止使用者重複點擊
  const [isSignUp,setIsSignUp]=useState(false);//是否註冊
  const [isResetPassword,setIsResetPassword]=useState(false);//是否重設密碼
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
      await saveSignUpdData(user);//存入DB
      getSignUp(user);////回呼disAutoPatch
      localStorage.setItem("token",response["user"]["uid"]);//存入uid到local storage
    } catch (error) {
      let errorMessage = error.code;
      getErrorMessage(errorMessage);
    }
    setLoading(false);
  };

  const handleReset=async()=>{
    setLoading(true);
    try{
      await  resetPassword( emailRef.current.value);
      getResetPassword(emailRef.current.value);
    }
    catch (error){
        let errorMessage = error.code;
        getErrorMessage(errorMessage);
      }
      setLoading(false);
    }

  return (
    <>
    
    <MemberDiv>
    <H1> KeepNote </H1>
    <MemberInputDiv>
    {/* 重設密碼區 */}
    {isResetPassword 
    ?
    <>
    <H3>重設密碼</H3>
      <InputDiv type="email" placeholder="輸入帳號" ref={emailRef} />
      {/* 顯示錯誤文字 */}
      {error ? <Text>{error}</Text> : null}
      {/* 顯示重設密碼文字 */}
      {reset ? <><Text>{reset}</Text> <Plink  onClick={(e)=> {e.preventDefault();setIsSignUp(false);;setIsResetPassword(false)}}> 點此登入帳號密碼</Plink> </>: null}
      <BtnDiv>
      {reset ?null
      :<SignUpBtn isSignUp={isSignUp} disabled={loading} onClick={handleReset}>
      重設密碼
      </SignUpBtn>}
      <Plink  onClick={(e)=> {e.preventDefault();setIsSignUp(true);setIsResetPassword(false)}}> 沒有帳戶？請點此註冊帳號</Plink>
      </BtnDiv>
    </>
    :
    <>
    {/* 註冊登入區 */}
      <H3>{isSignUp?"註冊" :"登入"} {currentUser ? currentUser.email : null}</H3>
      <InputDiv type="email" placeholder="輸入帳號" ref={emailRef} />
      {isSignUp?null:<Plink style={{alignSelf:"flex-end"}} onClick={(e)=> {e.preventDefault();setIsSignUp(true);setIsResetPassword(true)}}> 忘記密碼？</Plink>}
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
    </>
    }
      </MemberInputDiv>
      </MemberDiv>
      
    </>
  );
};

export default Member;
