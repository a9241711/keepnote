import styled from "styled-components";
import { Text,IconDiv ,Media_Query_SM} from "../../../components/constant";
import { Close,Clock } from "../../../assets";
import { useEffect, useState,useContext } from "react";
import { deleteNotification,queryNotification, } from "../../../store/HandleDb";
import NoteContext from "../../context/NoteContext";
import HeaderLoadContext from "../../../header/HeaderLoadContext";


const NotifDelete=styled(IconDiv)`
    background-image: url(${Close});
    display:none;
    box-sizing: border-box;
    margin: 0;
`
const NotifTime=styled(Text)``
const NotofDiv=styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    width: 175px;
    background-color:rgba(0,0,0,0.03);
    box-sizing: border-box;
    position: relative;
    margin:5px 10px;
    border-radius: 20px;
    margin-bottom: 20px;
    &:hover ${NotifDelete}{
        display: block;
        cursor: pointer;
    }
    &:hover ${NotifTime}{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    ${Media_Query_SM} {
        max-width: 160px;
        margin:0px;
    }
`
const NotifIcon=styled(IconDiv)`
    background-image: url(${Clock});
    margin: 0;
    &:hover{
        background-color: transparent;
    }
`


const NotificationDelete=({id, uid,whenToNotify,setDataChanged,})=>{
    const[notify,setNotify]=useState("");
    const{setIsLoading}=useContext(HeaderLoadContext);
    const handleDeleteNoti=async()=>{//刪除notification
        //List修改框
            const res=await deleteNotification(uid,id);
            console.log(res)
            if(res.success){setNotify("")}
            setDataChanged(true);
        }

    const handleTimeFromDb=(whenToNotify)=>{//處理時間轉換
        // if(whenToNotify===""){ setNotify("");}
        // else{
            const dateInMillis=whenToNotify* 1000;
            const notifyByTime=new Date(dateInMillis).toLocaleDateString(undefined,{month:"short",day:"numeric"})+" " +  new Date(dateInMillis).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
            setNotify(notifyByTime);
        // }
    }
    useEffect(()=>{
        if(whenToNotify===""){return setNotify("");}
        console.log("deleteingnotifcaiotn")
        handleTimeFromDb(whenToNotify);
    },[whenToNotify]);
 
    return(
        <>
        {notify? 
            <NotofDiv>
            <NotifIcon></NotifIcon>
            <NotifTime>{notify}</NotifTime>
            <NotifDelete onClick={handleDeleteNoti}></NotifDelete>
            </NotofDiv>
        :null
        }
        </>
    )
}

export default  NotificationDelete;


//From PopUp Midify
export const NotificationPopUpDelete=({selected,uid,setDataChanged,notificationChange,setNotificationChange})=>{
    const[notify,setNotify]=useState("");
    const{selectedItem,getNotificationUpdate}=useContext(NoteContext);
    const{whenToNotify}=selectedItem;
    const handleDeleteNoti=async()=>{//刪除notification
        console.log("deleteing")
            const{id}=selectedItem;
            const res=await deleteNotification(uid,id);
            if(res.success){setNotify("")}
            setDataChanged(true);
        }
    const handleTimeFromDb=async()=>{//處理時間轉換
        console.log("pop up Time");
        const{id}=selectedItem;
        const res=await queryNotification(uid,id);
        if(res.error  || typeof res =="undefined")return
        const dateInMillis=res["whenToNotify"]* 1000;
        const notifyByTime=new Date(dateInMillis).toLocaleDateString(undefined,{month:"short",day:"numeric"})+" " +  new Date(dateInMillis).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
        setNotify(notifyByTime);
        setDataChanged(true);
    }
    useEffect(()=>{
        if(!selected)return
        handleTimeFromDb();
        setNotificationChange(false);
    },[notificationChange])
    
    return(
        <>
        {notify? 
            <NotofDiv>
            <NotifIcon></NotifIcon>
            <NotifTime>{notify}</NotifTime>
            <NotifDelete onClick={handleDeleteNoti}></NotifDelete>
        </NotofDiv>
        :null
        }
        </>
    )
}

//From Edit
export const NotificationDeleteEdit=({isFromEdit,notification,setNotification})=>{
    const[notifFromEdit,setNotifFromEdit]=useState("");
    const handleNotificaiotn=()=>{
        const{timer}=notification;
        console.log(notification,timer)
        const notifyByTime=new Date(timer).toLocaleDateString(undefined,{month:"short",day:"numeric"})+" " +  new Date(timer).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
        setNotifFromEdit(notifyByTime);
    }
    useEffect(()=>{
        if(notification==="")return
        handleNotificaiotn();
    },[notification])

    return(
        <>
        {notification? 
            <NotofDiv>
            <NotifIcon></NotifIcon>
            <NotifTime>{notifFromEdit}</NotifTime>
            <NotifDelete onClick={()=> {setNotification("");setNotifFromEdit("")}}></NotifDelete>
        </NotofDiv>
        :null
        }
        </>
    )
}