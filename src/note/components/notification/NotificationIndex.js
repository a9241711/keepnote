import { requestForToken } from "../../../store/HandleDb";
import styled from "styled-components";
import { useState,useRef, useEffect, useContext } from "react";
import { Button, IconDiv,IconTipText,Text } from "../../../components/constant";
import { Notification } from "../../../assets";
import { getMessaging,onMessage,getToken } from "firebase/messaging";
import NotificationPop from "./NotificationPop";
import NoteContext from "../../context/NoteContext";

const NotificationDiv=styled.div`
  position: relative;
`
const NotificationIcon=styled(IconDiv)`
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${Notification}) ;
  &:hover{
    cursor: pointer;
  }
`      

const NotificationInputDiv=styled(IconDiv)`
    width:320px;
    height: fit-content;
    background-color: #FFFFFF;
    position: absolute;
    top:${props=>{return props.selected? "-260px":"35px"}} ;
    left:0;
    z-index: 0;
    border-radius: 8px;
    border: none;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    overflow: hidden;
    box-shadow: 0 1px 2px 0 rgb(60 64 67/30%), 0 2px 6px 2px rgb(60 64 67 /15%);
    z-index: 5;
    &:hover{
        background-color: #FFFFFF;
        border-radius:unset;
    }
`
const NotificationTextDiv=styled.div`
  width:100%;
  padding:25px 10px;
  border-bottom: 1px solid #CCCCCC;
  box-sizing: border-box;
`

const NotificationText=styled(Text)`
  cursor: default;
`
const NotificationSelectDiv=styled.div`
  display: flex;
  padding: 0px 35px 0 15px;
  width: 270px;
  flex-direction: column;
`

const InputDate=styled.input.attrs({
  type:"date", 
  required:true,
})
`
  width: 100%;
  height:35px;
  border:none;
  border-bottom: 1px solid #CCCCCC;
  color: #202124;;
  margin:10px 0;
  font-size: 14px;
  padding:0;
  background-color: transparent;
`
const InputTime=styled(InputDate).attrs({
  type:"time",
  required:true,
})
`
  width: 100%;
  font-size: 14px;
`
const BtnDiv=styled.div`
  align-self: end;
  margin: 15px 0;
    &:hover{
    cursor:${(props)=> { return props.time =="" || props.date ==""?"not-allowed":"pointer"}} ;
  }
`
const BtnSummit=styled(Button)`
    pointer-events: ${(props)=> { return props.time =="" || props.date ==""?"none":"auto"}} ;

`

const messaging=getMessaging();
const publicVapidKey=process.env.REACT_APP_VAPID_KEY;

const NotificationIndex=({uid,id,noteText,noteTitle,setDataChanged,selected,setNotification,isFromEdit})=>{//From edit and list section
    const[date,setDate]=useState("");
    const[time,setTime]=useState("");
    const[clickNotificate,setClickNotificate]=useState(false);//是否點擊到該icon;
    const notificationIconRef=useRef();
    const{updateTitle,updateText,selectedItem}=useContext(NoteContext);
    
    const handleSave=async ()=>{
      const dateTime=date+"T"+time;
      const timer=new Date(dateTime).getTime() //取得時間戳
      if(isFromEdit){
        getToken(messaging,{vapidKey:publicVapidKey})
        .then((currentToken) => {
          return setNotification({timer,currentToken})
        })//傳回Edit頁面
      }
      else{//List視窗修改
        const response=await requestForToken(uid,noteTitle,noteText,timer,id)//傳回uid跟token儲存回db
        console.log("handleSave",response);
        setDataChanged(true);
      }
      setClickNotificate(false)
    }

    const disablePastDate=()=>{//只能選擇當下時間點以後的時間
      let today=new Date();
      let dd=String(today.getDate()).padStart(2, '0'); //padStart用給定用於填充的字串，以重複的方式，插入到目標字串的起頭(左側)，直到目標字串到達指定長度。
      let mm=String(today.getMonth() + 1).padStart(2, '0');
      let yyyy=today.getFullYear();
      return `${yyyy}-${mm}-${dd}`;
    }

    useEffect(()=>{//觀察是否click到非Notification icon
      const handleClickNotificationIcon=(e)=>{
        if(!notificationIconRef.current.contains(e.target)){
            return setClickNotificate(false);
        }
    }
      if(clickNotificate){
          document.addEventListener("click",handleClickNotificationIcon);
      }
      return ()=>{ document.removeEventListener("click",handleClickNotificationIcon)};//取消觀察
  },[clickNotificate])

    return(
      <>
        <NotificationDiv ref={notificationIconRef}>
        <NotificationIcon  onClick={()=>  setClickNotificate(!clickNotificate) }>
        <IconTipText   >提醒我</IconTipText>
        </NotificationIcon>

        {clickNotificate
        ?<NotificationInputDiv selected={selected}>
        <NotificationTextDiv>
        <NotificationText>選擇日期與時間</NotificationText>
        </NotificationTextDiv>
        <NotificationSelectDiv>
        <InputDate  value={date} min={disablePastDate()} onChange={(e)=>setDate(e.target.value)}/> 
        <InputTime    value={time} onChange={(e)=>setTime(e.target.value)}/>
        </NotificationSelectDiv>
        <BtnDiv date={date} time={time}>
        <BtnSummit date={date} time={time} onClick={handleSave} >儲存</BtnSummit>
        </BtnDiv>
        </NotificationInputDiv>
        :null}
        </NotificationDiv>
      </>
    )
}

export default NotificationIndex;

export const NotificationElement=({setClickNotificate,clickNotificate})=>{//單純Icon element
  const notificationIconRef=useRef();
  return(
    <NotificationDiv ref={notificationIconRef}>
    <NotificationIcon  onClick={()=>  setClickNotificate(!clickNotificate) }>
    <IconTipText   >提醒我</IconTipText>
    </NotificationIcon>
    </NotificationDiv>
  )
}


const NotificationPopUpInputDiv=styled.div`
    width:320px;
    height: fit-content;
    background-color: #FFFFFF;
    position: absolute;
    left: 10%;
    bottom: 37px;
    z-index: 0;
    border-radius: 8px;
    border: none;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    overflow: hidden;
    box-shadow: 0 1px 2px 0 rgb(60 64 67/30%), 0 2px 6px 2px rgb(60 64 67 /15%);
    z-index: 9999;
    &:hover{
        background-color: #FFFFFF;
        border-radius:unset;
    }

`

export const NotificationEdit=({uid, selected, setDataChanged,notificationChange,setNotificationChange,setClickNotificate})=>{//forPopUp
    const[date,setDate]=useState("");
    const[time,setTime]=useState("");
    const{updateTitle,updateText,selectedItem,getNotificationUpdate}=useContext(NoteContext);
    
    const handleSave=async ()=>{
      const dateTime=date+"T"+time;
      const timer=new Date(dateTime).getTime() //取得時間戳
      const{id}=selectedItem;
      const response=await requestForToken(uid,updateTitle,updateText,timer,id)//傳回uid跟token儲存回db
      getToken(messaging,{vapidKey:publicVapidKey})
      .then((currentToken) => {
        return getNotificationUpdate(timer,currentToken) 
      })//傳回Edit頁面
      
      console.log("handleSave",response);
      setDataChanged(true);
      setNotificationChange(true);
      setClickNotificate(false);
    }

    const disablePastDate=()=>{//只能選擇當下時間點以後的時間
      let today=new Date();
      let dd=String(today.getDate()).padStart(2, '0'); //padStart用給定用於填充的字串，以重複的方式，插入到目標字串的起頭(左側)，直到目標字串到達指定長度。
      let mm=String(today.getMonth() + 1).padStart(2, '0');
      let yyyy=today.getFullYear();
      return `${yyyy}-${mm}-${dd}`;
    }
    return(
      <>
        <NotificationPopUpInputDiv >
        <NotificationTextDiv>
        <NotificationText>選擇日期與時間</NotificationText>
        </NotificationTextDiv>
        <NotificationSelectDiv>
        <InputDate  value={date} min={disablePastDate()} onChange={(e)=>setDate(e.target.value)}/> 
        <InputTime    value={time} onChange={(e)=>setTime(e.target.value)}/>
        </NotificationSelectDiv>
        <BtnDiv date={date} time={time}>
        <BtnSummit date={date} time={time} onClick={handleSave} >儲存</BtnSummit>
        </BtnDiv>
        </NotificationPopUpInputDiv>
        </>
    )
}