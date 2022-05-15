import { useContext, useReducer,useLayoutEffect, useState,useRef, useEffect } from "react";
import styled from "styled-components";
import { NoteTitleInput,NoteTextInput,Text } from "../../components/constant";
import NoteContext from "../context/NoteContext";

const NoteDiv=styled.div`
  width: 100%;
  display:flex;
  justify-content: flex-start;
  flex-direction: column;
`
const NoteTime=styled(Text)`
  font-size: 12px;
  text-align: end;
  margin: 10px 0;
  padding-right: 10px;
`


const NoteInput=()=>{
  const {selectedItem,getNoteUpdateTitle,getNoteUpdateText,noteHeight} =useContext(NoteContext);
  // const myRef = useRef();//PopUp彈出框
  const{id, noteText, noteTitle, index,image,color,time}=selectedItem;
  const[updateTitle,setUpdateTitle]=useState(noteTitle);
  const[updateText,setUpdateText]=useState(noteText);
  const{titleHeight, textHeight}=noteHeight;//取得輸入框高度
  console.log(noteHeight)
  // updateTextList(updateTitleRef.current.value,updateTextRef.currentvalue);
    //控制修改文字框的height
  const handleAutoHeight=(e)=>{
    if(!e.target.value){e.target.style.height= "auto"}
    else{e.target.style.height=e.target.scrollHeight + "px";
  console.log(e.target.scrollHeight)}
  }
  //控制修改文字
  const handleUpdateTitle = (e) => {
    setUpdateTitle(e.target.value);
    getNoteUpdateTitle(e.target.value);
    handleAutoHeight(e);
  };
  const handleUpdateText = (e) => {
    setUpdateText(e.target.value);
    getNoteUpdateText(e.target.value);
    handleAutoHeight(e);
  };

    return(
        <>
        <NoteDiv >    
        <NoteTitleInput
          value={updateTitle}
          style={{height:titleHeight+ "px"}}
          onChange={ handleUpdateTitle}>
          </NoteTitleInput>
        <NoteTextInput
          value={updateText} 
          style={{height:textHeight + "px"}}
          onChange={handleUpdateText}>
          </NoteTextInput>
        <NoteTime>{time}</NoteTime>
        </NoteDiv>
        </>
    )
}

export default NoteInput;