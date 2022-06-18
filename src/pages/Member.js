
import { useState, useRef, useContext,useEffect } from "react";
import { useNavigate,Link } from "react-router-dom";
import styled from "styled-components";
import { H3,H1, Media_Query_SM,Button,Text } from "../components/constant";
import { LeftArrow } from "../assets";
import GoogleSign from "../store/thirdpary/GoogleSign";
import { signIn, signUp, useAuth,resetPassword } from "../store/AuthFirebase";
import { saveSignUpdData } from "../store/handledb/MemberDb";
import AuthContext from "../store/AuthContext";

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
  ${Media_Query_SM}{
    max-width: 90%;
    width: 100%;
    padding: 10px;
  }
`
const MemberInputDiv=styled.div`
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;
  justify-content: center;
  align-items: center;
  width: 400px;
  border-radius: 6px;
  ${Media_Query_SM}{
    width: 90%;
  }
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
  margin:5px 0 10px 0;
  width: 45%;
  border-radius: 8px;
  height: 40px;
  background: #FBBC04;
  border-radius: 8px;
  color: #FFFFFF;
`
const LoginBtn=styled(SignUpBtn)`
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
const LoginLink=styled(Link)`
  text-decoration: none;
  text-decoration: underline;
  display: block;
  transition: all ease-in .2s;
  color: #202124;
  font-weight: 400;
  font-family: Roboto, Arial, sans-serif;
  margin: 10px 0;
  &:hover{
      cursor:pointer;
        color: #FBBC04;
        text-decoration: underline;
  }
`
const BackToIndex=styled.div`
  position: absolute;
  left:5%;
  top:5%;
  width: 32px;
  height: 32px;
  background: no-repeat;
  background-image: url(${LeftArrow});
  &:hover{
    cursor: pointer;
  }
`

const MemberSignIn = () => {//登入
  const {getSignIn,getErrorMessage,error,getResetPassword,reset} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);//防止使用者重複點擊
  const [isResetPassword,setIsResetPassword]=useState(false);//是否重設密碼
  const navigation=useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const currentUser = useAuth();

  const handleLogin = async () => {//登入fn
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
        photoURL: response["user"]["photoURL"]
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

  const handleReset=async()=>{//重設密碼 fn
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
  useEffect(()=>{
    emailRef.current.value="test@gmail.com";
    passwordRef.current.value="123456";
  },[])

  return (
    <>
    <MemberDiv>
      <Link to={"/"}>
        <BackToIndex></BackToIndex>
      </Link>
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
          {reset ? <><Text>{reset}</Text> <Plink  onClick={(e)=> {e.preventDefault();setIsResetPassword(!isResetPassword)}}> 點此登入帳號密碼</Plink> </>: null}
          <BtnDiv>
          {reset ?null
          :<SignUpBtn  disabled={loading} onClick={handleReset}>
          重設密碼
          </SignUpBtn>}
          <Plink  onClick={(e)=> {e.preventDefault();setIsResetPassword(!isResetPassword)}}> 沒有帳戶？請點此註冊帳號</Plink>
          </BtnDiv>
        </>
        :
        <>
        {/* 登入區 */}
          <H3> {currentUser ?currentUser.email +" 已登入": "登入"}</H3>
          {currentUser ?<>
          <LoginLink  to={"/"}>回到首頁</LoginLink> 
          </>
          : 
          <>
          <InputDiv type="email" placeholder="輸入帳號" ref={emailRef} />
          <Plink style={{alignSelf:"flex-end"}} onClick={(e)=> {e.preventDefault();setIsResetPassword(true)}}> 忘記密碼？</Plink>
          <InputDiv type="password" placeholder="輸入密碼" ref={passwordRef} />
          {/* 顯示錯誤文字 */}
          {error ? <Text>{error}</Text> : null}
          <BtnDiv>
          <LoginBtn disabled={loading} onClick={handleLogin }>
            登入
          </LoginBtn>
          <LoginLink  to={"/signup"}>沒有帳戶？請點此註冊帳號</LoginLink> 
          </BtnDiv>
          <GoogleSign />
          </>
          }
        </>
        }
      </MemberInputDiv>
    </MemberDiv>
    </>
  );
};
export default MemberSignIn;




export const MemberSignUp = () => {//註冊
    const {getSignUp,getErrorMessage,error,} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);//防止使用者重複點擊
    const emailRef = useRef();
    const passwordRef = useRef();
    const currentUser = useAuth();
  
    const handleSignUp = async () => {//註冊 fn
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
          providerId:"firebase",
          photoURL: response["user"]["photoURL"]
        };
        await saveSignUpdData(user);//存入DB
        getSignUp(user);////回呼disAutoPatch
        localStorage.setItem("token",JSON.stringify(user));//存入uid到local storage
        // navigation("/login", { replace: true });
      } catch (error) {
        let errorMessage = error.code;
        getErrorMessage(errorMessage);
      }
      setLoading(false);
    };
  
  return (
      <>
      <MemberDiv>
        <Link to={"/"}>
          <BackToIndex></BackToIndex>
        </Link>
        <H1> KeepNote </H1>
        <MemberInputDiv>

        {/* 註冊登入區 */}
          <H3> {currentUser ?"註冊成功"+ currentUser.email : "註冊"}</H3>
          {currentUser
          ?<LoginLink  to={"/"}>回到首頁</LoginLink>
          :<>
            <InputDiv type="email" placeholder="輸入帳號" ref={emailRef} />
            <InputDiv type="password" placeholder="請輸入至少6個字元密碼" ref={passwordRef} />
            {/* 顯示錯誤文字 */}
            {error ? <Text>{error}</Text> : null}
            <BtnDiv>
            <SignUpBtn  disabled={loading} onClick={handleSignUp}>
              註冊
            </SignUpBtn>
            <LoginLink  to={"/login"}>已有帳號？點此登入</LoginLink>
            </BtnDiv>
          </>
          } 
        </MemberInputDiv>
      </MemberDiv>   
      </>
  );
};

