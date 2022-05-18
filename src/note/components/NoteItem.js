import React,{ useState, useEffect, useRef, useContext, useLayoutEffect } from "react";
import styled from "styled-components";
import { Text, Button, LargerAnimate, IconDiv } from "../../components/constant";
import NotificationDelete from "./notification/NotificationDelete";
import NoteContext from "../context/NoteContext";



const BoardList=styled.div` //board img的DIV
    width:100%;
    background:#f9f6f6;
`
const BoardImg=styled.img`//board img
    width:100%;
    pointer-events:none;
`

const NoteLists = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
  padding: 5px 10px;
  transition: all ease-in-out .2s; 
  position: relative;
  cursor: pointer;
`;

const NoteDiv=styled.div`
  width: 100%;
  display:flex;
  justify-content: flex-start;
  flex-direction: column;
  padding: 0 10px;
  margin-bottom:  10px;
  margin-top: 10px;
  box-sizing: border-box;
`
const NoteTitle=styled(Text)`
  font-size: 16px;
  font-weight: 400;
  margin:5px 0;
`
const NoteText=styled(Text)`
  margin:5px 0;
`
const NoteNone=styled(Text)`
  font-size: 26px;
`

const NoteItem = ({
  id,
  noteText="null",
  noteTitle="null",
  image,
  setList,
  setDataChanged,
  uid,
  setSelected,whenToNotify
}) => {
  const{getSelectedItem,getColorUpdate,getNoteUpdateTitle,getNoteUpdateText,getNoteHeight}=useContext(NoteContext);
 const heightTitleRef=useRef();
 const heightTextRef=useRef();
  //控制選擇的貼文
  const handleClickNote = (e) => {
    const clickImgId=e.target.parentNode.id;
    const { id, noteText, noteTitle, index,color,image,time,whenToNotify,board} = setList.find(
      (pre) => pre.id === e.target.id ||pre.id===clickImgId
    );
    console.log(whenToNotify)
    getSelectedItem(id, noteText, noteTitle, index,image,time,color,whenToNotify,board );
    getColorUpdate(color);
    getNoteUpdateTitle(noteTitle);
    getNoteUpdateText(noteText);
    handleHeight(heightTitleRef.current.offsetHeight/2,heightTextRef.current.offsetHeight/2);
    setSelected(true);
  };
  const handleHeight=(titleHeight,textHeight)=>{//處理最小高度
    const minHeight=24;
    const heightObj={titleHeight,textHeight}
    if(titleHeight<minHeight){
      heightObj.titleHeight=minHeight;
    }if(textHeight<minHeight){
      heightObj.textHeight=minHeight;
    }
    getNoteHeight(heightObj.titleHeight,heightObj.textHeight) 
  }



  return (
    <>
        <NoteLists  id={id} onClick={(e) => handleClickNote(e)}>
        { image ?
        <BoardList>
            <BoardImg src={image}></BoardImg>
        </BoardList>
        : null }

        {!image && !noteTitle &&!noteText 
        ?<NoteNone>空白記事</NoteNone>
        :
        <NoteDiv >      
        <NoteTitle ref={heightTitleRef}>{noteTitle}</NoteTitle>
        <NoteText ref={heightTextRef}>{noteText}</NoteText>
        </NoteDiv>  }
        </NoteLists>
      <NotificationDelete setDataChanged={setDataChanged} whenToNotify={whenToNotify}  id={id} uid={uid} />
    </>
  );
};

export default React.memo(NoteItem) ;
