import { updateNoteStatus } from "../../store/HandleDb";
import styled from "styled-components";
import { IconDiv ,IconTipText,} from "../../components/constant";
import { ArchiveImg } from "../../assets";
import NoteColor from "./color/NoteColor";
import NotificationIndex from "./notification/NotificationIndex";
import Permission from "../../components/permission/Permssion";
import { useState } from "react";
import { useEffect } from "react";


const ArchiveIcon=styled(IconDiv)`
  background-image: url(${ArchiveImg}) ;
  cursor: pointer;
`


const NoteTool=({setIsArchive,setDataChanged,uid,userEmail,id,setList ,noteText,noteTitle,permissionEmail,owner,targetEmail})=>{
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



