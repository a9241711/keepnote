import { updateNoteStatusBack } from "../../../store/HandleDb";
import { useState } from "react";
import ArchivePopDelete from "./ArchivePopDelete";
import { IconDiv,IconTipText } from "../../../components/constant";
import { DeleteCheck,ArchiveBack } from "../../../assets";
import styled from "styled-components";

const DeleteIcon=styled(IconDiv)`
  background-image: url(${DeleteCheck}) ;
  cursor: pointer;
`
const ArchiveBackIcon=styled(IconDiv)`
  background-image: url(${ArchiveBack}) ;
  cursor: pointer;
`

const ArchiveTool=({setDataChanged,uid,id,permissionEmail,owner,userEmail })=>{//for Archive Index，共用noteTool css
    const[alertText,setAlertText]=useState();
    const[alert,setAlert]=useState(false);
    //刪除DB&&state
    const handleClickDelete = async () => {//刪除fn
      if(owner ){//如果是貼文擁有者且permissionEmail有值,跳出訊息告警直接刪除
        setAlert(true);
        setAlertText("所有共用對象將無法再看到刪除的記事");
        }
        else if(!owner && typeof permissionEmail !=="undefined")//非擁有者且permissionEmail有值，跳出訊息告警
        {
          setAlert(true);
          setAlertText("這則記事將不再與您共用")
        }
    }
    const updateItem = async () => {//恢復封存狀態 fn
      await updateNoteStatusBack(id,uid);
      setDataChanged(true);
    };
  

    return(
      <>
      <DeleteIcon onClick={()=>handleClickDelete()}>
        <IconTipText>刪除</IconTipText>
      </DeleteIcon>
      <ArchiveBackIcon onClick={()=>updateItem()}>
        <IconTipText>取消封存</IconTipText>
      </ArchiveBackIcon>
      {alert? 
      <ArchivePopDelete uid={uid} id={id} alertText={alertText} setAlertText={setAlertText} setDataChanged={setDataChanged} setAlert={setAlert}/>
      :null}
      </>
    )
  }

  export default ArchiveTool