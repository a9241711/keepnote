import { deleteDbNote } from "../../store/HandleDb";
import styled from "styled-components";
import { IconDiv ,IconTipText} from "../../components/constant";
import { DeleteCheck,ColorPalette } from "../../assets";
import { useRef, useState } from "react";
import NoteColor from "./color/NoteColor";
import NotificationIndex from "./notification/NotificationIndex";


const DeleteIcon=styled(IconDiv)`
  background-image: url(${DeleteCheck}) ;
`

const NoteTool=({setDataChanged,uid,id,setList ,noteText,noteTitle})=>{
    // const[clickColor,setClickColor]=useState(false);
    // const currentRef=useRef();
  //刪除DB&&state
  const deleteItem = async () => {
    await deleteDbNote(id,uid);
    setDataChanged(true);
  };
 
    return(
      <>
      <DeleteIcon onClick={()=>deleteItem()}>
      <IconTipText>刪除</IconTipText>
      </DeleteIcon>
      <NotificationIndex  uid={uid} id={id} noteText={noteText} noteTitle={noteTitle}  setDataChanged={setDataChanged}/>
      <NoteColor uid={uid} id={id} setList={setList} setDataChanged={setDataChanged}  />
      </>
    )
}

export default NoteTool;