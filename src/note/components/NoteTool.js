import { deleteDbNote,UpdateNoteStatus,UpdateNoteStatusBack } from "../../store/HandleDb";
import styled from "styled-components";
import { IconDiv ,IconTipText} from "../../components/constant";
import { DeleteCheck,ArchiveImg,ArchiveBack } from "../../assets";
import { useRef, useState } from "react";
import NoteColor from "./color/NoteColor";
import NotificationIndex from "./notification/NotificationIndex";


const ArchiveIcon=styled(IconDiv)`
  background-image: url(${ArchiveImg}) ;
  cursor: pointer;
`
const DeleteIcon=styled(IconDiv)`
  background-image: url(${DeleteCheck}) ;
  cursor: pointer;
`
const ArchiveBackIcon=styled(IconDiv)`
  background-image: url(${ArchiveBack}) ;
  cursor: pointer;
`

const NoteTool=({setDataChanged,uid,id,setList ,noteText,noteTitle})=>{
    // const[clickColor,setClickColor]=useState(false);
    // const currentRef=useRef();
  //刪除DB&&state
  // const deleteItem = async () => {
  //   await deleteDbNote(id,uid);
  //   setDataChanged(true);
  // };
  const updateItem = async () => {
    await UpdateNoteStatus(id,uid);
    setDataChanged(true);
  };
 
    return(
      <>
      <ArchiveIcon onClick={()=>updateItem()}>
      <IconTipText>封存</IconTipText>
      </ArchiveIcon>
      <NotificationIndex  uid={uid} id={id} noteText={noteText} noteTitle={noteTitle}  setDataChanged={setDataChanged}/>
      <NoteColor uid={uid} id={id} setList={setList} setDataChanged={setDataChanged}  />
      </>
    )
}

export default NoteTool;

export const ArchiveTool=({setDataChanged,uid,id })=>{
//刪除DB&&state
const deleteItem = async () => {//刪除
  await deleteDbNote(id,uid);
  setDataChanged(true);
};
const updateItem = async () => {//恢復狀態
  await UpdateNoteStatusBack(id,uid);
  setDataChanged(true);
};

  return(
    <>
    <DeleteIcon onClick={()=>deleteItem()}>
    <IconTipText>刪除</IconTipText>
    </DeleteIcon>
    <ArchiveBackIcon onClick={()=>updateItem()}>
    <IconTipText>取消封存</IconTipText>
    </ArchiveBackIcon>
    </>
  )
}

