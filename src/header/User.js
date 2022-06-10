import React from 'react';
import styled from 'styled-components';
import {IconTipText} from "../../src/components/constant";
import { useState,useEffect } from 'react';
import { queryUserImg } from '../store/HandleDb';


const UserTipText=styled.div`
    font-size: 12px;
    visibility: hidden;
    background-color: rgba(0,0,0,0.8);
    color: #c1c1c1;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    position: absolute;
    top:90%;
    right: 5%;
    word-break: keep-all;
    z-index: 500;
    @media screen and (min-width: 320px) and (max-width: 480px){
    display: none;
    }
    @media screen and (min-width: 481px) and (max-width: 768px){
    display: none;
    }
`
const UserDiv=styled.div`
    width: 40px;
    height: 40px;
    color: #FFFFFF;
    background-color: #5C6BC0;
    border-radius: 50%;
    text-align: center;
    line-height: 40px;
    font-size: 16px;
    font-weight: 700;
    border:1px solid grey;
    &:hover  ${UserTipText}{
      visibility: visible;
    }
`
const ProfileImg=styled.img`
    width: 100%;
    height: 100%;
    border-radius: 50%;
`

const UserImgDiv=styled(UserDiv)`
    background-color: transparent;
`

function User({isLoggin}) {//home header
    const{email,uid}=isLoggin;
    const userName= email.toUpperCase().slice(0,1);
    const[img,setImg]=useState(null);

    useEffect(()=>{
      const handleQueryImg=async()=>{
          const response=await queryUserImg(uid);
          if(response){
              const{profileUrl}=response;
              setImg(profileUrl);
          }
      }
      handleQueryImg();

  },[img])
  return (
    <>
    {img===null? 
    <UserDiv>
        {userName}
        <UserTipText>{email}</UserTipText>
    </UserDiv>
    :
    <UserImgDiv >
        <ProfileImg src={img}></ProfileImg>
        <UserTipText>{email}</UserTipText>
    </UserImgDiv>
    }
    </>
  )
}

export default User


const UserPermmisionDiv=styled(UserDiv)`
    width: 40px;
`
const UserImg=styled.img`
    height:32px;
    border-radius: 50%;
`
export function UserPermission({email,profileUrl}) {//for Permission page
  const userName= email.toUpperCase().slice(0,1);
return (
  < >
        {profileUrl!==null?
          <UserImgDiv >
            <UserImg src={profileUrl}></UserImg>
          </UserImgDiv>
        :
        <UserPermmisionDiv>
            {userName}
        </UserPermmisionDiv>}
  </>
  )
}

export function UserEdit({uid,email}) {//for Edit page
  const userName= email.toUpperCase().slice(0,1);
  const[img,setImg]=useState(null);
  useEffect(()=>{
    const handleQueryImg=async()=>{
        const response=await queryUserImg(uid);
        if(response){
            const{profileUrl}=response;
            setImg(profileUrl);
        }
    }
    handleQueryImg();
  },[img])
  return (
    < >
          {img!==null?
            <UserImgDiv >
              <UserImg src={img}></UserImg>
            </UserImgDiv>
          :
          <UserPermmisionDiv>
              {userName}
          </UserPermmisionDiv>}
    </>
  )
}


