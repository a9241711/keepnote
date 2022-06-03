import styled from "styled-components";
import { UserS, PermissionClose } from "../../assets";
import { Text,IconDiv, IconTipText } from "../constant";
import { useContext, useEffect,useState } from "react";
import { v4 } from "uuid";
import NoteContext from "../../note/context/NoteContext";

const PermissionUserDiv=styled.div`
    /* width:100%; */
    height: 30px;
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

const PermissionItem=({permissionEmail})=>{//Permission List item Area
    const[emailList,setEmailList]=useState(permissionEmail);

    useEffect(()=>{
        setEmailList(permissionEmail);
    },[permissionEmail])

    return(
        <>
        {typeof emailList!=="undefined"?
        <PermissionUserDiv >
        {emailList.map((email)=>{
                const id=v4();
                return(
                    <UserIcon key={id} id={id}><IconTipText>{email}</IconTipText></UserIcon>
                )
            })}
         </PermissionUserDiv>
        
        :null} 
        </>
        )
 }

export default PermissionItem

export const PermissionItemModi=()=>{//Permission for modify Area
    const{permissionList}=useContext(NoteContext);
    
    const{permissionEmail,owner,targetEmail}=permissionList;
    const[emailList,setEmailList]=useState(permissionEmail);
    console.log("permissionEmail",permissionEmail,typeof permissionEmail);
    

    useEffect(()=>{
        setEmailList(permissionEmail);
    },[permissionEmail])

    return(
        <>
        {typeof emailList!=="undefined"?
        <PermissionUserDiv >
        {emailList.map((email)=>{
                const id=v4();
                return(
                    <UserIcon key={id} id={id}><IconTipText>{email}</IconTipText></UserIcon>
                )
            })}
         </PermissionUserDiv>
        
        :null} 
        </>
        )
 }



