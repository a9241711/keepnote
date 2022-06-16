import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import { v4 } from "uuid";
import styled from "styled-components";
import { LargerAnimate,NoteTitleInput,NoteTextInput,Media_Query_SM,Media_Query_SMD,Media_Query_MD, IconDiv } from "../../../components/constant";
import { Plus,EditBoard } from "../../../assets";
import { NotificationDeleteEdit } from "../notification/NotificationDelete";
import { NoteModiEditBtnMb } from "../modify/NoteModiBtn";
import { NotificationEditMb,NotificationElement } from "../notification/NotificationIndex";
import { NoteColorPopMb,NoteColorElement } from "../color/NoteColor";
import { PermissionEditArea } from "../../../components/permission/Permission";
import { PermissionItemEdit } from "../../../components/permission/PermissionItem";
import { saveNoteData } from "../../../store/handledb/NoteDb";



//For Edit Mobile
const NoteListModify = styled.div`//修改內容的Div
    width: 100%;
    /* max-width: 600px; */
    height: auto;
    min-height: 195px;
    max-height: 500px;
    position: relative;
    padding:10px 10px 30px 10px;
    box-sizing: border-box;
    box-shadow: 0 1px 2px 0 rgb(60 64 67/30%), 0 2px 6px 2px rgb(60 64 67 /15%);
    border-radius: 8px;
    background-color: #ffffff;
    overflow-y: auto;
    overflow-x: hidden;
    &::-webkit-scrollbar {
          width: 12px;
          ${Media_Query_SMD}{
          display: none; 
          }
          ${Media_Query_SM}{
          display: none; 
          }
      }
      &::-webkit-scrollbar-button {
          height: 0;}
      &::-webkit-scrollbar-track {
          background: transparent; 
          border: 0;
      }
      &::-webkit-scrollbar-thumb {
          border-width: 1px 1px 1px 2px;
          background-color: rgba(0,0,0,.2);
          background-clip: padding-box;
          border: solid transparent;
          box-shadow: inset 1px 1px 0 rgb(0 0 0 / 10%), inset 0 -1px 0 rgb(0 0 0 / 7%);
      }
      &::-webkit-scrollbar-corner {
      background: transparent}
      /* Handle on hover */
      &::-webkit-scrollbar-thumb:hover {
          border-width: 1px 1px 1px 2px;
          background-color: rgba(0,0,0,.4);
          background-clip: padding-box;
          border: solid transparent;
          }
      //set up media query
      ${Media_Query_MD}{
        display: flex;
        flex-direction: column;
        height: 100%;
        max-width:unset;
        min-height: unset;
        max-height: unset;
        padding:unset;
        border-radius:unset;
      }
      ${Media_Query_SMD}{
        display: flex;
        flex-direction: column;
        max-width: unset;
        height: 100%;
        min-height: unset;
        max-height: unset;
        padding:unset;
        border-radius:unset;
      }
      ${Media_Query_SM}{
        display: flex;
        flex-direction: column;
        height: 100%;
        min-height: unset;
        max-height: unset;
        padding:unset;
        border-radius:unset;
      }
`
const NodeToolDiv=styled.div`//彈出框的tool div，手機版fixed在底部
    display: flex;
    /* max-width: 600px; */
    width: 100%;
    justify-content: space-between;
    padding:0 10px;
    position: relative;
    bottom: 20px;
    box-sizing: border-box;
    box-shadow: 0px -1px 8px -1px rgba(0,0,0,0.23);
    border-radius: 8px;
    z-index: 15;
        //set up media query
        ${Media_Query_MD}{
        border-radius:unset;
        bottom: 0;
        max-width:unset;
      }
        ${Media_Query_SMD}{
        max-width: unset;
        border-radius:unset;
        bottom: 0;
        max-width:unset;
      }
        ${Media_Query_SM}{
        border-radius:unset;
        bottom: 0;
      }
`
const BoardAdd=styled(IconDiv)` //新增畫板的Icon
    background-repeat: no-repeat;
    background-position: center;
    background-image: url(${EditBoard}) ;
`
const NoteListEditDiv=styled.div`
    background-color: transparent;
    border: none;
    padding: 0;
    position: fixed;
    width: fit-content;
    width: 100%;
    height: 100%;
    top:0;
    right: 0;
    left: 0;
    z-index: 4001;
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    animation: ${LargerAnimate} 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
      ${Media_Query_MD}{
        display: flex;
      }
      ${Media_Query_SMD}{
        display: flex;
      }
      ${Media_Query_SM}{
        display: flex;
      }
`
const NoteListEditBm=styled.div`
    width: 100%;
    height: 45px;
    position: fixed;
    left: 0;
    background: #ebebeb;
    bottom: 0;
    display: none;
    justify-content: center;
    z-index: 3500;
      ${Media_Query_MD}{
        display: flex;
      }
      ${Media_Query_SMD}{
        display: flex;
      }
      ${Media_Query_SM}{
        display: flex;
      }
`
const NoteEditAddDiv=styled.div`
    width: 50px;
    height: 50px;
    transform: translateY(-35px);
    display: none;
    background: #f0f0f0f7;
    border-radius: 15px 15px;
    align-items: center;
    border: 5px solid #FFFFFF;
    justify-content: center;
      ${Media_Query_MD}{
        display: flex;
      }
      ${Media_Query_SMD}{
        display: flex;
      }
      ${Media_Query_SM}{
        display: flex;
      }
`
const NoteEditAdd=styled(IconDiv)`
    background-repeat: no-repeat;
    background-position: center;
    background-image: url(${Plus}) ;
`
const NoteTitleInputDiv=styled(NoteTitleInput)`
    height: 22px;
    line-height: 22px;
`
const NoteTextInputDiv=styled(NoteTextInput)`
    height: 22px;
    line-height: 22px;
`
const NoteEditMb =({uid,setDataChanged,userEmail})=>{//forEdit in Mobile
    const[noteTitle,setNoteTitle]=useState("");
    const[noteText,setNoteText]=useState("");
    const[noteColor,setNoteColor]=useState("#FFFFFF");
    const[notification,setNotification]=useState(1);
    const[emailList,setEmailList]=useState([]);
    const[clickNotificate,setClickNotificate]=useState(false);//是否點擊NotificationIcon;
    const[clickColor,setClickColor]=useState(false);//是否點擊ColorIcon
    const[isClickEdit,setIsClickEdit]=useState(false);//是否點擊Add新增
    const[isClose,setIsClose]=useState(false);//檢查是否按關閉
    const id =v4();
    //auto height 輸入框
      //控制修改文字框的height
      const handleAutoHeight=(e)=>{
        e.target.style.height=e.target.scrollHeight + "px";
      }
  
      const getNodeTitleValue=(e)=>{
        setNoteTitle(e.currentTarget.value);
        handleAutoHeight(e);
      }
  
      const getNodeTextValue=(e)=>{
        setNoteText(e.currentTarget.value);
        handleAutoHeight(e);
      }
    const handleSaveNoteToDb=async ()=>{
      if(notification!==1){
        const{timer,currentToken}=notification;
        await saveNoteData(id,noteTitle,noteText,uid,noteColor,timer,currentToken,emailList);
        setDataChanged(true);
        setIsClose(true);
        setIsClickEdit(false);
        }
  
      else{
        const timer=1; 
        const currentToken=1;
        await saveNoteData(id,noteTitle,noteText,uid,noteColor,timer,currentToken,emailList);
        setDataChanged(true);
        setIsClose(true);
        setIsClickEdit(false);
      }
    }
    useEffect(()=>{//是否按下關閉，是則清空內容
        if(!isClose)return 
        setNoteTitle("");
        setNoteText("");
        setNoteColor("#FFFFFF");
        setNotification(1);
        setIsClose(false);
      },[isClose])
return(
    <>
    {isClickEdit?
    <>
      <NoteListEditDiv>
          <NoteListModify  style={{background:noteColor}}  id={id}     >
            <NoteTitleInputDiv style={{backgroundColor: noteColor}} value={noteTitle} onChange={getNodeTitleValue}  ></NoteTitleInputDiv>
            <NoteTextInputDiv style={{backgroundColor: noteColor}}  value={noteText} onChange={getNodeTextValue}  ></NoteTextInputDiv>
            <PermissionItemEdit permissionEmail={emailList}/>
            <NotificationDeleteEdit   notification={notification} setNotification={setNotification} />
          </NoteListModify>
          <NodeToolDiv style={{background:noteColor}}>
            <Link  to={"/boarding"} state={{id:id,uid}}>
            <BoardAdd  onClick={handleSaveNoteToDb}></BoardAdd>
            </Link>
            <NotificationElement   setClickNotificate={setClickNotificate}/>
            <NoteColorElement setClickColor={setClickColor} />
            <PermissionEditArea uid={uid}userEmail={userEmail}setEmailList={setEmailList} emailList={emailList} />
            <NoteModiEditBtnMb setIsClickEdit={setIsClickEdit} handleSaveNoteToDb={handleSaveNoteToDb} setIsClose={setIsClose}/>
            {clickNotificate?<NotificationEditMb setClickNotificate={setClickNotificate} setNotification={setNotification}/> :null}    
            {clickColor? <NoteColorPopMb  setClickColor={setClickColor} setNoteColor={setNoteColor}/>:null}
          </NodeToolDiv>
      </NoteListEditDiv> 
    </>
    :<NoteListEditBm>
      <NoteEditAddDiv>
        <NoteEditAdd onClick={()=>setIsClickEdit(true)}></NoteEditAdd>
      </NoteEditAddDiv>
    </NoteListEditBm>
    }
    </>
  )
}
export default NoteEditMb