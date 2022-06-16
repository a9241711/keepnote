import styled from "styled-components";
import { v4 } from "uuid";
import { UserS, } from "../../assets";
import { IconDiv, IconTipText } from "../constant";
import { useContext, useEffect,useState } from "react";
import NoteContext from "../../note/context/NoteContext";
import { queryUserImgForItemByEmail } from "../../store/handledb/MemberDb";

const PermissionUserDiv=styled.div`
    /* width:100%; */
    height: 40px;
    display: flex;
    align-items: center;
    box-sizing: border-box;
    /* margin: 10px ; */
`

const UserIcon=styled(IconDiv)`
    background-image: url(${UserS}) ;
    background-position: center;
    background-repeat: no-repeat;
    z-index: 11;
`
const UserDiv=styled(IconDiv)`
    background-image: unset;
`

const UserImg=styled.img`
    height:24px;
    width:24px;
    border-radius: 50%;
    border:1px solid #565656;
`
const handleQueryImg=async(permissionEmail,setEmailList)=>{
    await queryUserImgForItemByEmail(permissionEmail,setEmailList)
}

const PermissionItem=({permissionEmail})=>{//Permission List item Area
    const[emailList,setEmailList]=useState(permissionEmail);
    useEffect(()=>{
        if(typeof permissionEmail==="undefined")return
        handleQueryImg(permissionEmail,setEmailList);
        // setEmailList(permissionEmail);
    },[permissionEmail])

    return(
        <>
        {typeof emailList!=="undefined"?
        <PermissionUserDiv >
        {emailList.map((item)=>{
                const id=v4();
                const{email,profileUrl}=item;
                if(profileUrl==null){
                    return(
                        <UserIcon key={id} id={id} >
                            <IconTipText>{email}</IconTipText>
                        </UserIcon>
                    )
                }else{
                    return(
                        <UserDiv key={id} id={id} >
                            <UserImg src={profileUrl}></UserImg>
                            <IconTipText>{email}</IconTipText>
                        </UserDiv>
                    )
                }
        })}
        </PermissionUserDiv>
        :null} 
        </>
        )
 }

export default PermissionItem

export const PermissionItemModi=()=>{//Permission for modify Area
    const{permissionList}=useContext(NoteContext);
    const{permissionEmail}=permissionList;
    const[emailList,setEmailList]=useState(permissionEmail);
    

    // useEffect(()=>{
    //     setEmailList(permissionEmail);
    // },[permissionEmail])
    useEffect(()=>{
        if(typeof permissionEmail==="undefined")return
        handleQueryImg(permissionEmail,setEmailList);
        // setEmailList(permissionEmail);
    },[permissionEmail])
    return(
        <>
        {typeof emailList!=="undefined"?
        <PermissionUserDiv >
        {emailList.map((item)=>{
                const id=v4();
                const{email,profileUrl}=item;
                if(profileUrl==null){
                    return(
                        <UserIcon key={id} id={id} >
                            <IconTipText>{email}</IconTipText>
                        </UserIcon>
                    )
                }else{
                    return(
                        <UserDiv key={id} id={id} >
                            <UserImg src={profileUrl}></UserImg>
                            <IconTipText>{email}</IconTipText>
                        </UserDiv>
                    )
                }
        })}
        </PermissionUserDiv>
        :null} 
        </>
        )
 }

export const PermissionItemEdit=({permissionEmail})=>{//Permission for Edit Area
    const[emailList,setEmailList]=useState(permissionEmail);
    useEffect(()=>{
        setEmailList(permissionEmail);
    },[permissionEmail])

    return(
        <>
        {typeof emailList!=="undefined"?
        <PermissionUserDiv >
        {emailList.map((item)=>{
                const id=v4();
                const{email,profileUrl}=item;
                if(profileUrl==null){
                    return(
                        <UserIcon key={id} id={id} >
                            <IconTipText>{email}</IconTipText>
                        </UserIcon>
                    )
                }else{
                    return(
                        <UserDiv key={id} id={id} >
                            <UserImg src={profileUrl}></UserImg>
                            <IconTipText>{email}</IconTipText>
                        </UserDiv>
                    )
                }
        })}
         </PermissionUserDiv>      
        :null} 
        </>
        )
 }