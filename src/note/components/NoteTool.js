import { deleteDbNote,updateNoteStatus,updateNoteStatusBack } from "../../store/HandleDb";
import styled from "styled-components";
import { IconDiv ,IconTipText,Text,LargerAnimate,Media_Query_SM,Media_Query_SMD,Media_Query_MD,CloseButton,Button, Media_Query_LG} from "../../components/constant";
import { DeleteCheck,ArchiveImg,ArchiveBack } from "../../assets";
import NoteColor from "./color/NoteColor";
import NotificationIndex from "./notification/NotificationIndex";
import Permission from "../../components/permission/Permssion";
import { useState } from "react";
import { useEffect } from "react";


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
  useEffect(()=>{//十秒自動關閉封存彈出視窗
    setTimeout(()=>{
      setIsArchive({show:false,id:null});setIsBeenArchive(false);},10000);
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

const NoteListModifyBg = styled.div`//修改文字的Fixed背景顏色，觸控版關閉
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(121, 122, 124, 0.6);
    z-index: 999;
    ${Media_Query_SMD}{
      display: none;
    }
    ${Media_Query_SM}{
      display: none;
    }
`;
const PermissionDiv=styled.div`
    background-color: transparent;
    border: none;
    padding: 16px;
    position: fixed;
    width: 100%;
    max-width: 600px;
    top:20%;
    right: 0;
    left: 0;
    z-index: 4001;
    margin: 0 auto;
    display: flex;
    align-items: center;
    flex-direction: column;
    animation: ${LargerAnimate} 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    ${Media_Query_LG}{
      left:70px
    }
    ${Media_Query_SMD}{
      max-width: 400px;
    }
    ${Media_Query_SM}{
      max-width: 320px;
    }
`
const PermissionEditDiv=styled.div`
    width:100%;
    height: auto;
    min-height: 195px;
    max-height: 500px;
    position: relative;
    padding:25px 15px 10px;
    box-sizing: border-box;
    box-shadow: 0 1px 2px 0 rgb(60 64 67/30%), 0 2px 6px 2px rgb(60 64 67 /15%);
    border-radius: 8px 8px 0 0;
    background-color: #ffffff;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    ${Media_Query_SM}{
        width: 90%;
        max-height: 320px;
    }
`
const ButtonDiv=styled.div`
    width:100%;
    display:flex;
    justify-content: flex-end;
`
const PermissionTitle=styled(Text)`
    font-size: 22px;
    margin-bottom: 20px;
`
const PermissionText=styled(Text)`
    font-size: 16px;
    margin-bottom: 20px;
`

export const ArchiveTool=({setDataChanged,uid,id,permissionEmail,owner,userEmail })=>{//for Archive page
  const[alertText,setAlertText]=useState();
  const [alert,setAlert]=useState(false);
//刪除DB&&state
const handleClickDelete = async () => {//刪除
  console.log("owner",owner,"permissionEmail",permissionEmail)
  if(owner ){//如果是貼文擁有者且permissionEmail有值,跳出訊息告警直接刪除
    setAlert(true);
    setAlertText("所有共用對象將無法再看到刪除的記事");

    }
    else if(!owner && typeof permissionEmail !=="undefined")//非擁有者且permissionEmail有值，跳出訊息告警
    {
      setAlert(true);
      setAlertText("這則記事將不再與您共用");

    }
   
  }
  const updateItem = async () => {//恢復封存狀態
    await updateNoteStatusBack(id,uid);
    setDataChanged(true);
  };

const handleDelete=async()=>{
    await deleteDbNote(id,uid);
    setDataChanged(true);
  }
const handleCancel=()=>{
    setAlert(false);
    setAlertText("");
  }
  return(
    <>
    <DeleteIcon onClick={()=>handleClickDelete()}>
    <IconTipText>刪除</IconTipText>
    </DeleteIcon>
    <ArchiveBackIcon onClick={()=>updateItem()}>
    <IconTipText>取消封存</IconTipText>
    </ArchiveBackIcon>
    {alert? 
    <>
    <NoteListModifyBg></NoteListModifyBg>
    <PermissionDiv>
      <PermissionEditDiv>
      <PermissionTitle>要刪除一則記事嗎？</PermissionTitle>
      <PermissionText>{alertText}</PermissionText>
      <ButtonDiv>
      <CloseButton onClick={()=>handleCancel()}>
        取消
      </CloseButton>
      <Button onClick={()=>handleDelete()}>
        刪除
      </Button>
      </ButtonDiv>
      </PermissionEditDiv>
    </PermissionDiv>
    </>
    :null}

    </>
  )
}

