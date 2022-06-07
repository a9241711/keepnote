import { useEffect, useState } from "react";
import styled from "styled-components";
import { savePermission } from "../../store/HandleDb";
import { AddUser,Check } from "../../assets";
import { IconDiv,IconTipText,Media_Query_SM,Media_Query_SMD,LargerAnimate,Button,CloseButton,Text, H3 } from "../constant";


const PermissionInputingDiv=styled.div`
    width: 100%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
`
const PermissionInputIconDiv=styled.div`
    width: 40px;
    height: 40px;
    /* border:1px solid #565656; */
    border-radius:50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0 5px;
`
const PermissionInputIcon=styled(IconDiv)`
    background-image: url(${AddUser}) ;
    cursor: pointer;
    width: 16px;
    height: 16px;
`
const PermissionInput=styled.input.attrs({
    placeholder: "共用對象的姓名或電子郵件地址",

    })`
    width: 90%;
    height: auto;
    font-size: 14px;
    font-weight: 400;
    resize:none;
    border: none;
    outline: none;
    box-sizing: border-box;
    background-color:transparent;
    overflow: hidden;
    margin:10px;
    ::placeholder {
      font-size: 14px;
      font-family: "Google Sans", Roboto, Arial, sans-serif;
    }
    &:focus {
      background-color: #FFFFFF;
    }
    ${Media_Query_SM}{
        width: 70%;
    }
`
const PermissionCheckIcon=styled(IconDiv)`
    background-image: url(${Check}) ;
    cursor: pointer;
    opacity: ${props=>{return props.permissionEmail.length?1:0}};
`

const PermissionEdit=({emailList,setEmailList,setEmailErrorMes,setEmailError,})=>{
    const[permissionEmail,setPermissionEmail]=useState("");
    const handleCheckEmail=(e)=>{
        console.log(e.target)
        e.preventDefault();
        const emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
        if(emailList.includes(permissionEmail)){
            setEmailErrorMes("這個電子信箱地址已存在");
        }
        else if(permissionEmail.search(emailRule)=== -1){
            setEmailErrorMes("電子信箱格式錯誤");     
        }
        else{//電箱格式正確且無重複

            setEmailList(pre=>[...pre,permissionEmail]);
            setPermissionEmail("");
        }
    }
    useEffect(()=>{//若正在填入email，Error為空
        setEmailErrorMes("");
        setEmailError([]);
    },[permissionEmail])

    return(
        <PermissionInputingDiv>
            <PermissionInputIconDiv>
            <PermissionInputIcon></PermissionInputIcon>
            </PermissionInputIconDiv>
            <PermissionInput tpye="text" onChange={(e)=>setPermissionEmail(e.target.value)} value={permissionEmail}></PermissionInput>
            <PermissionCheckIcon onClick={handleCheckEmail} permissionEmail={permissionEmail}></PermissionCheckIcon>
         </PermissionInputingDiv>
    )
}

export default PermissionEdit
