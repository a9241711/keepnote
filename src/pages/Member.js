
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

const MemberSignIn = () => {//??????
  const {getSignIn,getErrorMessage,error,getResetPassword,reset} = useContext(AuthContext);
  const [loading, setLoading] = useState(false);//???????????????????????????
  const [isResetPassword,setIsResetPassword]=useState(false);//??????????????????
  const navigation=useNavigate();
  const emailRef = useRef();
  const passwordRef = useRef();
  const currentUser = useAuth();

  const handleLogin = async () => {//??????fn
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
      getSignIn(user); //??????disAutoPatch;
      localStorage.setItem("token",JSON.stringify(user));//??????uid???local storage
      navigation("/", { replace: true });
    } catch (error) {
      let errorMessage = error.code;
      getErrorMessage(errorMessage);
    }
    setLoading(false);
  };

  const handleReset=async()=>{//???????????? fn
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
        {/* ??????????????? */}
        {isResetPassword 
        ?
        <>
        <H3>????????????</H3>
          <InputDiv type="email" placeholder="????????????" ref={emailRef} />
          {/* ?????????????????? */}
          {error ? <Text>{error}</Text> : null}
          {/* ???????????????????????? */}
          {reset ? <><Text>{reset}</Text> <Plink  onClick={(e)=> {e.preventDefault();setIsResetPassword(!isResetPassword)}}> ????????????????????????</Plink> </>: null}
          <BtnDiv>
          {reset ?null
          :<SignUpBtn  disabled={loading} onClick={handleReset}>
          ????????????
          </SignUpBtn>}
          <Plink  onClick={(e)=> {e.preventDefault();setIsResetPassword(!isResetPassword)}}> ????????????????????????????????????</Plink>
          </BtnDiv>
        </>
        :
        <>
        {/* ????????? */}
          <H3> {currentUser ?currentUser.email +" ?????????": "??????"}</H3>
          {currentUser ?<>
          <LoginLink  to={"/"}>????????????</LoginLink> 
          </>
          : 
          <>
          <InputDiv type="email" placeholder="????????????" ref={emailRef} />
          <Plink style={{alignSelf:"flex-end"}} onClick={(e)=> {e.preventDefault();setIsResetPassword(true)}}> ???????????????</Plink>
          <InputDiv type="password" placeholder="????????????" ref={passwordRef} />
          {/* ?????????????????? */}
          {error ? <Text>{error}</Text> : null}
          <BtnDiv>
          <LoginBtn disabled={loading} onClick={handleLogin }>
            ??????
          </LoginBtn>
          <LoginLink  to={"/signup"}>????????????????????????????????????</LoginLink> 
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




export const MemberSignUp = () => {//??????
    const {getSignUp,getErrorMessage,error,} = useContext(AuthContext);
    const [loading, setLoading] = useState(false);//???????????????????????????
    const emailRef = useRef();
    const passwordRef = useRef();
    const currentUser = useAuth();
  
    const handleSignUp = async () => {//?????? fn
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
        await saveSignUpdData(user);//??????DB
        getSignUp(user);////??????disAutoPatch
        localStorage.setItem("token",JSON.stringify(user));//??????uid???local storage
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

        {/* ??????????????? */}
          <H3> {currentUser ?"????????????"+ currentUser.email : "??????"}</H3>
          {currentUser
          ?<LoginLink  to={"/"}>????????????</LoginLink>
          :<>
            <InputDiv type="email" placeholder="????????????" ref={emailRef} />
            <InputDiv type="password" placeholder="???????????????6???????????????" ref={passwordRef} />
            {/* ?????????????????? */}
            {error ? <Text>{error}</Text> : null}
            <BtnDiv>
            <SignUpBtn  disabled={loading} onClick={handleSignUp}>
              ??????
            </SignUpBtn>
            <LoginLink  to={"/login"}>???????????????????????????</LoginLink>
            </BtnDiv>
          </>
          } 
        </MemberInputDiv>
      </MemberDiv>   
      </>
  );
};

