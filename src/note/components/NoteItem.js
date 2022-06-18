import React,{  useRef, useContext, } from "react";
import styled from "styled-components";
import {  Media_Query_SM, Text, } from "../../components/constant";
import NotificationDelete from "./notification/NotificationDelete";
import NoteContext from "../context/NoteContext";
import PermissionItem from "../../components/permission/PermissionItem";



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
    padding: 3px;
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
const PermissionNotifiDiv=styled.div`//permission and notification shows div
    display: flex;
    flex-wrap:wrap;
    align-items: center;
    padding:0 10px;
    ${Media_Query_SM}{
      padding:0 3px;
    }
`

const NoteItem = ({uid,id,noteText="null",noteTitle="null",image,setList,setDataChanged,setSelected,whenToNotify="",permissionEmail,}) => {
  const{getSelectedItem,getColorUpdate,getNoteUpdateTitle,getNoteUpdateText,getNoteHeight,getPermissionItem}=useContext(NoteContext);
  const heightTitleRef=useRef();
  const heightTextRef=useRef();
  //控制選擇的貼文
  const handleClickNote = (e) => {
    const clickImgId=e.target.parentNode.id;
    const { id, noteText, noteTitle, index,color,image,time,whenToNotify,board,permissionEmail,owner,targetEmail} = setList.find(
      (pre) => pre.id === e.target.id ||pre.id===clickImgId
    );
    getSelectedItem(id, noteText, noteTitle, index,image,time,color,whenToNotify,board );
    getColorUpdate(color);
    getNoteUpdateTitle(noteTitle);
    getNoteUpdateText(noteText);
    handleHeight(heightTitleRef,heightTextRef);
    getPermissionItem(permissionEmail,owner,targetEmail);
    setSelected(true);
  };
  const handleHeight=(heightTitleRef,heightTextRef)=>{//處理最小高度
    const minHeight=32;
    if(typeof heightTitleRef.current =="undefined" ||typeof heightTextRef.current =="undefined")
    {
      const heightObj={titleHeight:minHeight,textHeight:minHeight};
      return getNoteHeight(heightObj.titleHeight,heightObj.textHeight);
    }
    else if( heightTitleRef.current ===null || heightTextRef.current ===null)
    {
      const heightObj={titleHeight:minHeight,textHeight:minHeight};
      return getNoteHeight(heightObj.titleHeight,heightObj.textHeight);
    }
    else{
      const titleHeight=heightTitleRef.current.offsetHeight/2;
      const textHeight=heightTextRef.current.offsetHeight/2;
      const heightObj={titleHeight,textHeight};
      if(titleHeight<minHeight){
        heightObj.titleHeight=minHeight;
      }if(textHeight<minHeight){
        heightObj.textHeight=minHeight;
      }
      getNoteHeight(heightObj.titleHeight,heightObj.textHeight);
    }
  }


  return (
    <>
      <NoteLists  id={id} onClick={(e) => handleClickNote(e)}>
        { image ?
        <BoardList>
            <BoardImg src={image}></BoardImg>
        </BoardList>
        : null }
        <NoteDiv >  
          {!image && !noteTitle &&!noteText 
          ?<NoteNone>空白記事</NoteNone>
          :
          <>
          <NoteTitle ref={heightTitleRef}>{noteTitle}</NoteTitle>
          <NoteText ref={heightTextRef}>{noteText}</NoteText>
          </>
          }
        </NoteDiv>
      </NoteLists>
      <PermissionNotifiDiv>
        <NotificationDelete setDataChanged={setDataChanged} whenToNotify={whenToNotify}  id={id} uid={uid} />
        <PermissionItem permissionEmail={permissionEmail}/>
      </PermissionNotifiDiv>
    </>
  );
};

export default NoteItem ;
