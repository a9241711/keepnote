import { Button, H3,Text,GlobalStyle } from "../constant";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { updateUserImg,queryUserImg } from "../../store/HandleDb";
import NavSideBar from "../../header/components/NavSideBar";
import { HeaderArchiveDiv } from "../../header/Header";
import { changePassword } from "../../store/AuthFirebase";


const MemberShipDiv=styled.div`
    width:100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-width: 600px;
    margin: 0 auto;
`
const UploadLabel=styled.label`
    width: 100%;
    height: 40px;
    position: absolute;
    bottom: 0;
    left:50%;
    transform: translateX(-50%);
    text-align: center;
    background: rgba(0,0,0,.7);
    color:wheat;
    line-height: 30px;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;

`
const ProfileDiv=styled.div`
    width: 200px;
    height:200px;
    margin-bottom: 20px;
    position: relative;
    border-radius:50%;
    overflow: hidden;
    border: 1px solid grey;
    color: #FFFFFF;
    background-color: transparent;
    &:hover ${UploadLabel}{
        opacity: 1;
        visibility: visible;
        transition:opacity .5s ease-in,visibility .5s ease-in;
    }
`
const UserDiv=styled(ProfileDiv)`
    font-size: 32px;
    line-height: 200px;
    text-align: center;
    background-color: #5C6BC0;
`

const ProfileImg=styled.img`
    width: 100%;
    height: 100%;
`
const UploadInput=styled.input`
    display: none;
`
const InforDiv=styled.div`
    width: 100%;
    max-width: 300px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    margin: 20px 0;
`
const MailText=styled(Text)`
    margin-bottom:10px;
`
const PasswordDiv=styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    margin-bottom:10px;
`
const PasswordInput=styled.input`
    height: auto;
    max-width: 200px;
    font-size: 14px;
    line-height: 14px;
    font-weight: 400;
    resize:none;
    border: none;
    outline: none;
    box-sizing: border-box;
    background-color:transparent;
    overflow: hidden;
    ::placeholder {
    font-size: 12px;
    font-family: "Google Sans", Roboto, Arial, sans-serif;
    }
    &:focus {
      background-color: transparent;
      border: 1px solid rgba(0,0,0,.2);
    }
`
const SubmmitDiv=styled.div`
    width:100%;
    display:flex;
    justify-content: flex-end;
`
const SubmmitBtn=styled(Button)``

const MemberShip=()=>{
    const isLoggin=JSON.parse(localStorage.getItem("token"));
    const{email,uid,providerId}=isLoggin;

    const userName= email.toUpperCase().slice(0,1) + email.split("@")[0].slice(1);//取得@前的名稱，並大寫第一個字
    const[img,setImg]=useState(null);
    const[error,setError]=useState();//圖片上傳錯誤訊息
    const[oldPassword,setOldPassword]=useState();//舊密碼
    const[password,setPassword]=useState();//密碼
    const[confirmPassword,setConfirmPassword]=useState();//確認密碼
    const[errorPassword,setErrorPassword]=useState();//密碼錯誤訊息
    const[isUpLoad,setIsUpLoad]=useState(false);


    const handleUpload=(e)=>{
        const file=e.target.files[0];
        console.log(e,"file",file);
        if(file.type.match('image.*')){//check if png or jpg
            const reader=new FileReader();
            reader.onloadend=async()=>{
                await updateUserImg(uid,reader.result)
            }
            reader.readAsDataURL(file);
            setIsUpLoad(true);
            setError();
        }else{
            setError("請上傳png 或 jpg 檔案格式，建議尺寸 200 *200 pixel");
        }
    }
    const handleChangePassword=async()=>{
        if(password===confirmPassword){
            try{
                await changePassword(oldPassword,password,setErrorPassword);
            }
            catch (error){
                console.log("error",error)
            }
        }
        else{
            setErrorPassword("請確認密碼是否一致");
        }
    }

    useEffect(()=>{//initial image圖片
        const handleQueryImg=async()=>{
            const response=await queryUserImg(uid);
            if(response){
                const{profileUrl}=response;
                setImg(profileUrl);
            }
        }
        handleQueryImg();
        setIsUpLoad(false);
    },[isUpLoad])

    return(
        <>
        <GlobalStyle/>
        <HeaderArchiveDiv isLoggin={isLoggin}/>
        <NavSideBar />
        <MemberShipDiv>
            <ProfileDiv>
                {img===null? 
                <UserDiv>{userName}</UserDiv>
                :<ProfileImg src={img}></ProfileImg>}
                <UploadInput type="file" id="file" onChange={handleUpload}></UploadInput>
                <UploadLabel htmlFor="file"> Choose Picture</UploadLabel>
            </ProfileDiv>
            <Text style={{color:"red"}}>{error}</Text>
            <H3>會員中心</H3>
            <InforDiv>
                <MailText>帳號：{email}</MailText>
                <MailText >修改密碼：</MailText>
                {providerId==="google.com"?<MailText >此帳號為Google登入，無提供修改密碼服務</MailText>
                :
                <>
                <PasswordDiv>
                    <Text >舊密碼：</Text>
                    <PasswordInput type="password" placeholder="輸入舊密碼" value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)}></PasswordInput>
                </PasswordDiv>
                <PasswordDiv>
                    <Text >新密碼：</Text>
                    <PasswordInput type="password" placeholder="輸入密碼" value={password} onChange={(e)=>setPassword(e.target.value)}></PasswordInput>
                </PasswordDiv>
                <PasswordDiv>
                    <Text >確認新密碼：</Text>
                    <PasswordInput type="password" placeholder="輸入確認密碼" value={confirmPassword} onChange={(e)=> setConfirmPassword(e.target.value)}></PasswordInput>
                </PasswordDiv>
                <Text style={{color:"red"}}>{errorPassword}</Text>
                <SubmmitDiv>
                    <SubmmitBtn onClick={handleChangePassword}>儲存密碼</SubmmitBtn>
                </SubmmitDiv>
                </>
                }
            </InforDiv>
        </MemberShipDiv>
        </>
    )
}

export default MemberShip