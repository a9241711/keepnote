import styled from "styled-components";
import { Link } from "react-router-dom";
import { v4 } from "uuid";
import { EditBoard } from "../../assets";
import { IconDiv,IconTipText, Media_Query_SM } from "../../components/constant";
import NoteColor from "./color/NoteColor";
import NotificationIndex from "./notification/NotificationIndex";
import { NoteModiEditBtn } from "./modify/NoteModiBtn";
import { saveNoteData } from "../../store/HandleDb";

const CanvasTools=styled(IconDiv)`//Edit上點擊前的Icon
    position:absolute;
    top: 50%;
    right: 0;
    left:${props=> {return props.titleClick?"10%":"unset"}};
    transform: translate(-50%, -50%);
    background-repeat: no-repeat;
    background-position: center;
    background-image: url(${EditBoard}) ;
`
const NodeToolDiv=styled.div`//彈出框的tool div
  display: flex;
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
const CanvasTool=({noteTitle ,noteText,uid,titleClick,setNoteColor,noteColor,setIsFromEdit,isFromEdit,setNotification,notification,setIsClose} )=>{//上方輸入框的icon，把文字跟board畫板帶入到下一個頁面並儲存
    const id =v4()
    const handleSaveNoteToDb=async ()=>{
      console.log(typeof notification!="undefined",notification)
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
        {titleClick
        ?
        <NodeToolDiv>
        <Link  to={"/boarding"} state={{id,uid}}>
        <BoardAdd onClick={handleSaveNoteToDb}><IconTipText>新增繪圖記事</IconTipText></BoardAdd>
        </Link>
        <NotificationIndex isFromEdit={isFromEdit} setIsFromEdit={setIsFromEdit} setNotification={setNotification}/>
        <NoteColor isFromEdit={isFromEdit} setIsFromEdit={setIsFromEdit} setNoteColor={setNoteColor}/>
        </NodeToolDiv>
        :<Link to={"/boarding"} state={{id,uid}}>
        <CanvasTools titleClick={titleClick}  onClick={handleSaveNoteToDb}><IconTipText>新增繪圖記事</IconTipText></CanvasTools>
        </Link>
        }
        </>
    )
}

export default CanvasTool

// //for 手機
// export const CanvasToolMb=({noteTitle ,noteText,uid,titleClick,setNoteColor,noteColor,setIsFromEdit,isFromEdit,setNotification,notification,setIsClose} )=>{//上方輸入框的icon，把文字跟board畫板帶入到下一個頁面並儲存
//   const id =v4()
//   const handleSaveNoteToDb=async ()=>{
//     console.log(typeof notification!="undefined",notification)
//     if(notification!==1){
//         const{timer,currentToken}=notification;
//         await saveNoteData(id,noteTitle,noteText,uid,noteColor,timer,currentToken);}
//     else{
//       const timer=1; 
//       const currentToken=1;
//       await saveNoteData(id,noteTitle,noteText,uid,noteColor,timer,currentToken);
//     }
// }
//   return(
//       <>
//       {titleClick
//       ?
//       <NodeToolDiv>
//       <Link  to={"/boarding"} state={{id,uid}}>
//       <BoardAdd onClick={handleSaveNoteToDb}></BoardAdd>
//       </Link>
//       <NotificationIndex isFromEdit={isFromEdit} setIsFromEdit={setIsFromEdit} setNotification={setNotification}/>
//       <NoteColor isFromEdit={isFromEdit} setIsFromEdit={setIsFromEdit} setNoteColor={setNoteColor}/>
//       <NoteModiEditBtn setIsClose={setIsClose}/>
//       </NodeToolDiv>
//       :<Link to={"/boarding"} state={{id,uid}}>
//       <CanvasTools titleClick={titleClick} ><IconTipText>新增繪圖記事</IconTipText></CanvasTools>
//       </Link>
//       }
//       </>
//   )
// }
