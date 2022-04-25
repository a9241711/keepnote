import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { NoteTitleInput, NoteTextInput, Text } from "../../components/constant";
import { db } from "../../store/firebase";
import {
  collection,
  updateDoc,
  doc,
  query,
  getDoc,
  where,
  getDocs,
  deleteDoc,
} from "firebase/firestore";

const DeleteBtn = styled.button`
  width: 50px;
`;

const NoteLists = styled.div`
  width: 280px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 30px 10px 18px 0;
  border-radius: 8px;
  box-sizing: border-box;
  border: 1px solid #e0e0e0;
  background: #ffffff;
  box-sizing: border-box;
  padding: 5px 15px;
`;

const NoteListModifyDiv = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(121, 122, 124, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
`;
const NoteListModify = styled.div`
  width: 600px;
  padding: 16px;
  box-sizing: border-box;
  box-shadow: 0 1px 2px 0 rgb(60 64 67/30%), 0 2px 6px 2px rgb(60 64 67 /15%);
  border-radius: 8px;
  background-color: #ffffff;
  width: 600px;
  margin-top: -20%;
`;

const NoteModifySubmmit = styled.button`
  width: 70px;
`;

const NoteItem = ({
  id,
  noteText,
  noteTitle,
  setList,
  deleteData,
  updateData,
}) => {
  const [selectedNote, setSelectNote] = useState(null);
  const [updateTitle, setUpdateTitle] = useState(noteTitle);
  const [updateText, setUpdateText] = useState(noteText);
  const [selected, setSelected] = useState(false);
  const myRef = useRef();
  const noteDbCollection = collection(db, "NoteList");
  //控制修改文字
  const handleUpdateTitle = (e) => {
    setUpdateTitle(e.target.value);
  };
  const handleUpdateText = (e) => {
    setUpdateText(e.target.value);
  };

  //控制送出修改按鈕
  const handleUpdateSubmmit = async () => {
    db.collection("NoteList").get().then((s)=>{
      s.forEach(element => {
       console.log(element.id) 
      });
    })
    const { id } = selectedNote;
    const setListCopy = [...setList];
    const x = setListCopy.findIndex((item) => item.id === id);
    setListCopy[x] = {
      id,
      noteTitle: updateTitle,
      noteText: updateText,

    };
    //讀取文件Id
    const updateToDb = doc(db, "NoteList", id);
    const updateNote = {
      id,
      noteText: updateTitle,
      noteTitle: updateText,

    };
    await updateDoc(updateToDb, updateNote);
    updateData(setListCopy);
  };

  //控制選擇的貼文
  const handleClickNote = (e) => {
    console.log(e.target, e.id);
    const { id, noteText, noteTitle, index } = setList.find(
      (pre) => pre.id === e.target.id
    );
    console.log({ id, noteText, noteTitle, index });
    setSelectNote({ ...selectedNote, id, noteText, noteTitle, index }); //找到陣列中的值
    setSelected(true);
  };

  //useEffect觀察setList

  //控制彈出視窗
  const handleClickOutside = (e) => {
    if (myRef.current === null || myRef.current === undefined) {
      return;
    } else if (!myRef.current.contains(e.target)) {
      setSelectNote(null);
      setSelected(false);
    }
  };
  const handleClickInside = (e) => {
    setSelected(true);
  };
  //刪除DB&&state
  const deleteItem = async () => {
    const deleteDbNote = doc(db, "NoteList", id);
    await deleteDoc(deleteDbNote);
    deleteData(function (prev) {
      console.log(prev);
      return prev.filter((item) => item.id !== id);
    });
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
        <Text>{noteTitle}</Text>
        <Text>{noteText}</Text>
        <DeleteBtn onClick={deleteItem}>刪除</DeleteBtn>
      </NoteLists>

      {selected ? (
        <NoteListModifyDiv>
          <NoteListModify
            id={id}
            ref={myRef}
            onClick={(e) => handleClickInside(e)}
          >
            <NoteTitleInput
              value={updateTitle}
              onChange={handleUpdateTitle}
            ></NoteTitleInput>
            <NoteTextInput
              value={updateText}
              onChange={handleUpdateText}
            ></NoteTextInput>
            <NoteModifySubmmit onClick={(e) => handleUpdateSubmmit(e)}>
              確認修改
            </NoteModifySubmmit>
          </NoteListModify>
        </NoteListModifyDiv>
      ) : null}
    </>
  );
};

export default NoteItem;
