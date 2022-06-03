import styled from "styled-components";
import { Text,IconDiv ,Media_Query_SM,Media_Query_SMD,Media_Query_MD,Media_Query_LG} from "../../../components/constant";
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
    width: 100%;
    background-color:rgba(0,0,0,0.03);
    box-sizing: border-box;
    position: relative;
    /* margin:5px 10px; */
    border-radius: 20px;
    /* margin-bottom: 20px; */
    &:hover ${NotifDelete}{
        display: block;
        cursor: pointer;
    }
    &:hover ${NotifTime}{
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    ${Media_Query_LG} {
        max-width: 175px;
        margin:0px;
    }
    ${Media_Query_MD} {
        max-width: 175px;
        margin:0px;
    }
    ${Media_Query_SMD} {
        max-width: 175px;
        margin:0px;
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
    console.log("uid id",uid,id)
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
        if(whenToNotify==1 || whenToNotify==""){return setNotify("");}
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
    const handleNotification=()=>{
        const{timer}=notification;
        console.log(notification,timer)
        const notifyByTime=new Date(timer).toLocaleDateString(undefined,{month:"short",day:"numeric"})+" " +  new Date(timer).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
        setNotifFromEdit(notifyByTime);
    }
    useEffect(()=>{
        if(notification===1)return
        handleNotification();
    },[notification])

    return(
        <>
        {notification!==1? 
            <NotofDiv>
            <NotifIcon></NotifIcon>
            <NotifTime>{notifFromEdit}</NotifTime>
            <NotifDelete onClick={()=> {setNotification(1);setNotifFromEdit("")}}></NotifDelete>
        </NotofDiv>
        :null
        }
        </>
    )
}


export const ArchiveNotification=({whenToNotify})=>{
    const[notify,setNotify]=useState("");
    const handleTimeFromDb=(whenToNotify)=>{//處理時間轉換
        const dateInMillis=whenToNotify* 1000;
        const notifyByTime=new Date(dateInMillis).toLocaleDateString(undefined,{month:"short",day:"numeric"})+" " +  new Date(dateInMillis).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"});
        setNotify(notifyByTime);

    }
    useEffect(()=>{
        if(whenToNotify==1 || whenToNotify==""){return setNotify("");}
        console.log("deleteingnotifcaiotn")
        handleTimeFromDb(whenToNotify);
    },[whenToNotify]);
 
    return(
        <>
        {notify? 
            <NotofDiv>
            <NotifIcon></NotifIcon>
            <NotifTime>{notify}</NotifTime>
            </NotofDiv>
        :null
        }
        </>
    )
}