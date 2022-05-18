import { useContext } from "react";
import styled from "styled-components";
import { Button, } from "../../../components/constant";
import { updateNoteData } from "../../../store/HandleDb";
import NoteContext from "../../context/NoteContext";

const NoteModifyDiv=styled.div`
display: flex;
align-items: center;
`
const NoteModifySubmmit = styled(Button)`
  &:hover{
    background-color: rgba(57,57,57,0.039);;
  }
`;

const NoteModiBtn=({uid,setSelected,setDataChanged})=>{
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
        // setSelectNote(null);
        // setPopUpColor(color);//若關閉，則回到原本的list文字與顏色

      }


    return(
        <NoteModifyDiv>
        <NoteModifySubmmit  onClick={() => handleUpdateSubmmit()}>
          確認修改
        </NoteModifySubmmit>
        <NoteModifySubmmit  onClick={() => handleClose()}>
          關閉
        </NoteModifySubmmit>
        </NoteModifyDiv>
    )
}

export default NoteModiBtn;


export const NoteModiEditBtn=({setIsClose})=>{
  
    return(
        <NoteModifyDiv>
        <NoteModifySubmmit  onClick={() => setIsClose(true)}>
          關閉
        </NoteModifySubmmit>
        </NoteModifyDiv>
    )
}
