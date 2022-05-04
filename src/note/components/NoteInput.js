import styled from "styled-components";
import { NoteTitleInput,NoteTextInput } from "../../components/constant";

const NoteDiv=styled.div`
width: 100%;
display:flex;
justify-content: flex-start;
flex-direction: column;
`
const NoteInput=({setSelected,updateText,updateTitle,setUpdateTitle,setUpdateText})=>{
  
    //控制修改文字框的height
  const handleAutoHeight=(e)=>{
    e.target.style.height=e.target.scrollHeight + "px"
  }
  //控制修改文字
  const handleUpdateTitle = (e) => {
    setUpdateTitle(e.target.value);
    handleAutoHeight(e);
  };
  const handleUpdateText = (e) => {
    setUpdateText(e.target.value);
    handleAutoHeight(e);
  };
  const handleClickInside = () => {
    setSelected(true);
  };

    return(
        <NoteDiv  onClick={() => handleClickInside()}>    
        <NoteTitleInput
          value={updateTitle}
          onChange={ handleUpdateTitle}
        ></NoteTitleInput>
        
        <NoteTextInput
          value={updateText}
          onChange={handleUpdateText}
        ></NoteTextInput>
        </NoteDiv>
    )
}

export default NoteInput;