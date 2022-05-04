import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { NoteTitleInput, NoteTextInput, Text, IconDiv,IconTipText,Button, LargerAnimate } from "../../components/constant";
import { deleteDbNote,updateNoteData } from "../../store/HandleDb";
import { Link } from "react-router-dom";
import { DeleteCheck } from "../../assets";
import { async } from "@firebase/util";
import NoteInput from "./NoteInput";



const BoardList=styled.div` //board img的DIV
    width:100%;
    background:#f9f6f6;
`
const BoardImg=styled.img`//board img
    width:100%;
    pointer-events:none;
`
const DeleteIconDiv=styled(IconDiv)`
  /* visibility: hidden; */
`
const NoteLists = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  box-sizing: border-box;
  background: #ffffff;
  padding: 5px 10px;
  transition: all ease-in-out .2s; 
  /* &:hover ${DeleteIconDiv}{
    visibility: visible;
  } */
`;

const NoteListModifyDiv = styled.div`//修改文字的div
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(121, 122, 124, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1;
`;
const NoteListModify = styled.div`
  width: 600px;
  padding: 10px;
  box-sizing: border-box;
  box-shadow: 0 1px 2px 0 rgb(60 64 67/30%), 0 2px 6px 2px rgb(60 64 67 /15%);
  border-radius: 8px;
  background-color: #ffffff;
  width: 600px;
  margin-top: -5%;
  animation: ${LargerAnimate } 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;;
`;

const NoteModifySubmmit = styled(Button)`
`;
const NodeToolDiv=styled.div`
  display: flex;
  justify-content: space-between;
  padding:0 10px;
`
const BoardAdd=styled(Button)`
`
const NoteDiv=styled.div`
  width: 100%;
  display:flex;
  justify-content: flex-start;
  flex-direction: column;
`
const NoteTitle=styled(Text)`
  font-size: 18px;
  font-weight: 700;
  margin:5px 0;
`
const NoteText=styled(Text)`
  margin:5px 0;
`
const NoteNone=styled(Text)`
  font-size: 26px;
`
const DeleteIcon=styled.div`
  width: 32px;
  height:32px;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${DeleteCheck}) ;
`   

const NoteItem = ({
  id,
  noteText="null",
  noteTitle="null",
  image,
  setList,
  setDataChanged,
  board,
  uid
}) => {
  const [selectedNote, setSelectNote] = useState(null);
  const [updateTitle, setUpdateTitle] = useState(noteTitle);
  const [updateText, setUpdateText] = useState(noteText);
  const [selected, setSelected] = useState(false);
  const myRef = useRef();

  //控制送出修改按鈕
  const handleUpdateSubmmit =async  () => {
    const { id } = selectedNote;
    const setListCopy = [...setList];
    let updateIndex = setListCopy.findIndex((item) => item.id === id);//找到要更新的list 項目
    setListCopy[updateIndex]["noteTitle"]=updateTitle;
    setListCopy[updateIndex]["noteText"]=updateText;
    const updateTextElements = {
      id,
      noteTitle: updateTitle,
      noteText: updateText,
    };
    await updateNoteData(id, updateTextElements,uid);
    setDataChanged(true);
  };

  //控制選擇的貼文
  const handleClickNote = (e) => {
    const clickImgId=e.target.parentNode.id;
    const { id, noteText, noteTitle, index } = setList.find(
      (pre) => pre.id === e.target.id ||pre.id===clickImgId
    );
    setSelectNote({ ...selectedNote, id, noteText, noteTitle, index }); //找到陣列中的值
    setSelected(true);
  };

  //控制彈出視窗
  const handleClickOutside = (e) => {
    if (myRef.current === null || myRef.current === undefined) {
      return;
    } else if (!myRef.current.contains(e.target)) {
      setSelectNote(null);
      setSelected(false);
    }
  };

  //控制關閉視窗
  const handleClose=()=>{
    setSelectNote(null);
    setSelected(false);
  }
  //刪除DB&&state
  const deleteItem = async () => {
    await deleteDbNote(id,uid);
    setDataChanged(true);
  };
  useEffect(() => {
    if (!myRef) {
      return;
    }
    document.addEventListener("mousedown", handleClickOutside);
    if (selected === false) {
      return () =>
        document.removeEventListener("mousedown", handleClickOutside, true);
    }
  }, [selected]);


  return (
    <>
        <NoteLists id={id} onClick={(e) => handleClickNote(e)}>
        { image ?
        <BoardList>
            <BoardImg src={image}></BoardImg>
        </BoardList>
        : null }

        {!image && !noteTitle &&!noteText 
        ?<NoteNone>空白記事</NoteNone>
        :
        <NoteDiv>      
        <NoteTitle>{noteTitle}</NoteTitle>
        <NoteText>{noteText}</NoteText></NoteDiv>  }
      </NoteLists>
      <DeleteIconDiv onClick={()=>deleteItem()}>
        <DeleteIcon>
        <IconTipText>刪除</IconTipText>
        </DeleteIcon>
      </DeleteIconDiv>

      {selected ? (
        <NoteListModifyDiv>
          <NoteListModify    id={id} ref={myRef}      >
            { image ?
            <Link  to={"/boarding"} state={{id,noteTitle,noteText,board,uid}}>
            <BoardList      
              >
            <BoardImg src={image}></BoardImg>
            </BoardList>
            </Link>
              : null }
            <NoteInput updateTitle={updateTitle}setUpdateTitle={setUpdateTitle} setUpdateText={setUpdateText}updateText={updateText} setSelected={setSelected}/>
            <NodeToolDiv>
            { image ? null
            :<Link  to={"/boarding"} state={{id,noteTitle,noteText,board,uid}}>
            <BoardAdd>新增繪圖</BoardAdd>
            </Link>}
            <NoteModifySubmmit  onClick={() => handleUpdateSubmmit()}>
              確認修改
            </NoteModifySubmmit>
            <NoteModifySubmmit  onClick={() => handleClose()}>
              關閉
            </NoteModifySubmmit>
            </NodeToolDiv>
          </NoteListModify>
        </NoteListModifyDiv>
      ) : null}
    </>
  );
};

export default NoteItem;
