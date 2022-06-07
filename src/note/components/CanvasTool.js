import styled from "styled-components";
import { Link } from "react-router-dom";
import { v4 } from "uuid";
import { EditBoard } from "../../assets";
import { IconDiv,IconTipText, Media_Query_SM } from "../../components/constant";
import NoteColor from "./color/NoteColor";
import NotificationIndex from "./notification/NotificationIndex";
import { NoteModiEditBtn } from "./modify/NoteModiBtn";
import { saveNoteData } from "../../store/HandleDb";
import { PermissionEditArea } from "../../components/permission/Permssion";

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
const BoardAdd=styled(IconDiv)` //新增畫板的Icon
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${EditBoard}) ;
`

//for桌機平板
const CanvasTool=({noteTitle ,noteText,uid,userEmail,titleClick,setNoteColor,noteColor,setEmailList,emailList,isFromEdit,setNotification,notification,setIsClose} )=>{
    const id =v4()
    const handleSaveNoteToDb=async ()=>{
      console.log(typeof notification!="undefined",notification);
      if(notification!==1){
          const{timer,currentToken}=notification;
          await saveNoteData(id,noteTitle,noteText,uid,noteColor,timer,currentToken);}
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

export default CanvasTool

