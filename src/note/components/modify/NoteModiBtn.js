import { useContext } from "react";
import styled from "styled-components";
import { Button,CloseButton, Media_Query_SM,Media_Query_SMD, Media_Query_MD} from "../../../components/constant";
import { updateNoteData } from "../../../store/HandleDb";
import NoteContext from "../../context/NoteContext";
import { deleteDbNote } from "../../../store/HandleDb";
import { LeftArrow } from "../../../assets";

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

const NoteModiBtn=({uid,setSelected,setDataChanged})=>{//popUp視窗按鈕
  const{updateTitle,updateText,selectedItem}=useContext(NoteContext);
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
    const deleteItem = async () => {
      const { id } = selectedItem;
        await deleteDbNote(id,uid);
        setSelected(false);
        setDataChanged(true);
      };

    return(
      <>
        <BackToIndex onClick={() => handleClose()}></BackToIndex>
        <NoteModifyDiv>
        <NoteModifyDelete  onClick={() => deleteItem()}>
          刪除
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


const NoteEditSubmmit = styled(Button)`//For 觸控版本使用
  /* display: none; */
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
  
    return(
        <NoteModifyDiv>
        <NoteModifyClose  onClick={() => setIsClose(true)}>
          取消
        </NoteModifyClose>
        <NoteEditSubmmit  onClick={() => handleSaveNoteToDb()}>
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