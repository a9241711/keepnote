import { useContext,useState,useEffect } from "react";
import styled from "styled-components";
import { Button,CloseButton, Media_Query_SM,Media_Query_SMD, Media_Query_MD} from "../../../components/constant";
import NoteContext from "../../context/NoteContext";
import { updateNoteStatus,updateNoteData, } from "../../../store/HandleDb";
import { LeftArrow } from "../../../assets";
import HeaderLoadContext from "../../../header/HeaderLoadContext";

const NoteModifyDiv=styled.div`
  display: flex;
  align-items: center;
`
const BackToIndex=styled.div`//回到上一頁
  ${Media_Query_SM}{
    position: fixed;
    left: 10px;
    top: 10px;
    width: 32px;
    height: 32px;
    background: no-repeat;
    background-image: url(${LeftArrow});
  }
`
const NoteModifyDelete = styled(CloseButton)`
    ${Media_Query_SM}{
    width: 80px;
  }
`;
const NoteModifyCancle=styled(CloseButton)`
  ${Media_Query_SM}{
    display: none;
  }
`;
const NoteModifyConfirm=styled(Button)`
  &:hover{
    background-color: rgba(57,57,57,0.039);
  }
  ${Media_Query_SM}{
      width: 80px;
      border-radius: 40px 40px;
      background-color: #FBBC04;
      color: #FFFFFF;
      &:active{
      border:1px solid black;
      color: black;
      background-color: #FFFFFF;
    }
  }
`

const NoteModiBtn=({uid,setSelected,setDataChanged,setIsArchive})=>{//popUp視窗按鈕
  const{updateTitle,updateText,selectedItem}=useContext(NoteContext);
  const[isArchive,setIsBeenArchive]=useState(false);
  //控制送出修改按鈕
  const handleUpdateSubmmit =async  () => {
    const { id } = selectedItem;
    const updateTextElements = {
      id,
      noteTitle: updateTitle,
      noteText: updateText,
    };
    await updateNoteData(id, updateTextElements,uid);
    setSelected(false);
    setDataChanged(true);
  };
  // //控制關閉視窗
  const handleClose=async()=>{
      setSelected(false);
    }
  const updateItemStatus = async () => {
    const { id } = selectedItem;
    await updateNoteStatus(id,uid);
    setDataChanged(true);
    setIsBeenArchive(true);
    };
  useEffect(()=>{//觀察是否有封存
    if(!isArchive)return
    const { id } = selectedItem;
    setTimeout(setIsArchive({show:true,id}),500);
    // setIsBeenArchive(false);
    setSelected(false);
    },[isArchive]);
  useEffect(()=>{//60秒自動關閉封存彈出視窗
    setTimeout(()=>{
      setIsArchive({show:false,id:null});setIsBeenArchive(false);},60000);
    },[isArchive]);
  return(
    <>
      <BackToIndex onClick={() => handleClose()}></BackToIndex>
      <NoteModifyDiv>
      <NoteModifyDelete  onClick={() => updateItemStatus()}>
        封存
      </NoteModifyDelete>
      <NoteModifyCancle  onClick={() => handleClose()}>
        取消
      </NoteModifyCancle>
      <NoteModifyConfirm  onClick={() => handleUpdateSubmmit()}>
        文字修改
      </NoteModifyConfirm>
      </NoteModifyDiv>
    </>
  )
}

export default NoteModiBtn;


const NoteEditSubmmit = styled(Button)`//For 載具版本使用
  pointer-events: ${props=>{return props.isLoading==="true"?"none":"auto"}};
  &:hover{
    background-color: rgba(57,57,57,0.039);
  }
  ${Media_Query_SM}{
      display: block;
      width: 65px;
      &:active{
        color:black;
      }
    }
  ${Media_Query_SMD}{
      display: block;
  }
  ${Media_Query_MD}{
      display: block;
  }
`;

const NoteModifyClose=styled(CloseButton)`
  ${Media_Query_SM}{
    width: 65px;
  }
`

export const NoteModiEditBtn=({setIsClose ,handleSaveNoteToDb})=>{//Edit區塊視窗按鈕
  const{isLoading}=useContext(HeaderLoadContext);
    return(
      <NoteModifyDiv>
        <NoteModifyClose  onClick={() => setIsClose(true)}>
          取消
        </NoteModifyClose>
        <NoteEditSubmmit isLoading={isLoading.toString()} disabled={isLoading} onClick={() => handleSaveNoteToDb()}>
          新增
        </NoteEditSubmmit>
      </NoteModifyDiv>
    )
}

export const NoteModiEditBtnMb=({setIsClickEdit,setIsClose ,handleSaveNoteToDb})=>{//Edit區塊視窗按鈕For Mobile
  return(
      <NoteModifyDiv>
        <NoteModifyClose  onClick={() => {setIsClose(true); setIsClickEdit(false)}}>
          取消
        </NoteModifyClose>
        <NoteEditSubmmit  onClick={() => {handleSaveNoteToDb();}}>
          新增
        </NoteEditSubmmit>
      </NoteModifyDiv>
  )
}