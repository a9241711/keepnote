import { useState,useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { IconDiv ,IconTipText,Media_Query_SM} from "../../components/constant";
import { v4 } from "uuid";
import { ArchiveImg,EditBoard } from "../../assets";
import NoteColor from "./color/NoteColor";
import NotificationIndex from "./notification/NotificationIndex";
import Permission,{ PermissionEditArea } from "../../components/permission/Permission";
import { updateNoteStatus } from "../../store/handledb/ArchiveDb";
import { saveNoteData } from "../../store/handledb/NoteDb";



const ArchiveIcon=styled(IconDiv)`
  background-image: url(${ArchiveImg}) ;
  cursor: pointer;
`
const BoardAdd=styled(IconDiv)` //新增畫板的Icon
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${EditBoard}) ;
`

const NoteTool=({setIsArchive,setDataChanged,uid,userEmail,id,setList ,noteText,noteTitle,image,board,permissionEmail,owner,targetEmail})=>{
  const[isArchive,setIsBeenArchive]=useState(false);
  const updateItemStatus = async () => {
    await updateNoteStatus(id,uid);
    setDataChanged(true);
    setIsBeenArchive(true);
  };
  useEffect(()=>{//觀察是否有封存
    if(!isArchive)return
    setTimeout(setIsArchive({show:true,id}),500);
  },[isArchive])

  useEffect(()=>{//60秒自動關閉封存彈出視窗
    setTimeout(()=>{
      setIsArchive({show:false,id:null});setIsBeenArchive(false);},60000);
  },[isArchive]);
 
    return(
      <>
      {image? null
      :<Link  to={"/boarding"} state={{id:id,board:board,uid}}>
      <BoardAdd ><IconTipText>新增畫板</IconTipText></BoardAdd>
      </Link>}
      <NotificationIndex  uid={uid} id={id} noteText={noteText} noteTitle={noteTitle}  setDataChanged={setDataChanged}/>
      <NoteColor uid={uid} id={id} setList={setList} setDataChanged={setDataChanged}  />
      <Permission uid={uid} id={id} userEmail={userEmail} permissionEmail={permissionEmail}owner={owner} targetEmail={targetEmail} setDataChanged={setDataChanged}/>
      <ArchiveIcon onClick={()=>updateItemStatus()}>
        <IconTipText>封存</IconTipText>
      </ArchiveIcon>
      </>
    )
}

export default NoteTool;


const CanvasTools=styled(IconDiv)`//Edit上點擊前的Icon
    position:absolute;
    top: 50%;
    right: 0;
    left:${props=> {return props.titleClick?"10%":"unset"}};
    transform: translate(-50%, -50%);
    background-repeat: no-repeat;
    background-position: center;
    background-image: url(${EditBoard}) ;
    display:${props=>{return props.titleClick?"none":"block"}};
`
const NodeToolDiv=styled.div`//彈出框的tool div
  display: ${props=>{return props.titleClick?"flex":"none"}};
  justify-content: space-between;
  padding:0 10px;
  position: relative;
  ${Media_Query_SM}{
    padding:unset;
  }
`


//for桌機平板
export const NoteEditTool=({noteTitle ,noteText,uid,userEmail,titleClick,setNoteColor,noteColor,setEmailList,emailList,isFromEdit,setNotification,notification,setIsClose} )=>{
    const id =v4();
    const handleSaveNoteToDb=async ()=>{
      if(notification!==1){
          const{timer,currentToken}=notification;
          await saveNoteData(id,noteTitle,noteText,uid,noteColor,timer,currentToken);
        }
      else{
          const timer=1; 
          const currentToken=1;
          await saveNoteData(id,noteTitle,noteText,uid,noteColor,timer,currentToken);
        }
    }
    return(
        <>
        <NodeToolDiv titleClick={titleClick}>
          <Link  to={"/boarding"} state={{id,uid}}>
            <BoardAdd onClick={handleSaveNoteToDb}><IconTipText>新增繪圖記事</IconTipText></BoardAdd>
          </Link>
          <NotificationIndex isFromEdit={isFromEdit} setNotification={setNotification}/>
          <NoteColor isFromEdit={isFromEdit}  setNoteColor={setNoteColor}/>
          <PermissionEditArea  uid={uid}userEmail={userEmail}setEmailList={setEmailList} emailList={emailList}/>
        </NodeToolDiv>
          <Link to={"/boarding"} state={{id,uid}}>
            <CanvasTools  titleClick={titleClick}  onClick={handleSaveNoteToDb}><IconTipText>新增繪圖記事</IconTipText></CanvasTools>
          </Link>
        </>
    )
}

