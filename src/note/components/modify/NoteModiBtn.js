import { useContext } from "react";
import styled from "styled-components";
import { Button, Media_Query_SM, } from "../../../components/constant";
import { updateNoteData } from "../../../store/HandleDb";
import NoteContext from "../../context/NoteContext";
import { deleteDbNote } from "../../../store/HandleDb";

const NoteModifyDiv=styled.div`
  display: flex;
  align-items: center;
`
const NoteModifySubmmit = styled(Button)`
  &:hover{
    background-color: rgba(57,57,57,0.039);
  }${Media_Query_SM}{
    width: 40px;
    &:active{
      background-color: rgba(57,57,57,0.039);
    }
  }
`;
const NoteModifyConfirm=styled(Button)`
  &:hover{
    background-color: rgba(57,57,57,0.039);
  }
  ${Media_Query_SM}{
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

const NoteModiBtn=({uid,setSelected,setDataChanged})=>{//popUp
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
        <NoteModifyDiv>
        <NoteModifySubmmit  onClick={() => deleteItem()}>
          刪除
        </NoteModifySubmmit>
        <NoteModifySubmmit  onClick={() => handleClose()}>
          取消
        </NoteModifySubmmit>
        <NoteModifyConfirm  onClick={() => handleUpdateSubmmit()}>
          文字修改
        </NoteModifyConfirm>
        </NoteModifyDiv>
    )
}

export default NoteModiBtn;


const NoteEditSubmmit = styled(Button)`//For 手機使用
  display: none;
  &:hover{
    background-color: rgba(57,57,57,0.039);
  }
  ${Media_Query_SM}{
      display: block;
      max-width: 65px;
      border-radius: 40px 40px;
      background-color: #FBBC04;
      color: #FFFFFF;
      &:active{
      border:1px solid black;
      color: black;
      background-color: #FFFFFF;
    }
  }
`;

const NoteModifyClose=styled(Button)`
    &:hover{
    background-color: rgba(57,57,57,0.039);;
  }
  ${Media_Query_SM}{
      max-width: 65px;
      /* border-radius: 40px 40px;
      background-color: #FBBC04;
      color:#FFFFFF;
    &:active{
      border:1px solid black;
      color: black;
      background-color: #FFFFFF;
    }  */
    }
`

export const NoteModiEditBtn=({setIsClose ,handleSaveNoteToDb})=>{//Edit區塊
  
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
