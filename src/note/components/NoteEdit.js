import { useEffect, useState,useRef } from "react";
import styled from "styled-components";
import {NoteTitleInput,NoteTextInput} from "../../components/constant"
import { v4 } from "uuid";
import { db } from "../../store/firebase";
import { collection,addDoc, setDoc,doc } from "firebase/firestore";
import { saveNoteData } from "../../store/HandleDb";
import CanvasTool from "./CanvasTool";

const NoteSubmmit=styled.button`
width:70px;
`

const NoteEdit=({addData,setList})=>{
    const[noteTitle,setNoteTitle]=useState("");
    const[noteText,setNoteText]=useState("");
    const[isInput,setIsInput]=useState(false);
    const[debouncedText,setDebouncedText]=useState();
    const typingTitleRef=useRef();
    const typingTextRef=useRef();


    const getNodeTitleValue=(e)=>{
        console.log(typingTitleRef.current)
        // setIsInput(true);
        setNoteTitle(e.currentTarget.value);
    }

    const getNodeTextValue=(e)=>{
        console.log(typingTextRef.current);
        // setIsInput(true)
        setNoteText(e.currentTarget.value);
    }

    const handleClickOutofTarget=(e)=>{//檢查是否點到輸入框以外，是或否都改變isinput狀態
        if(!typingTitleRef.current.contains(e.target) && !typingTextRef.current.contains(e.target)){
            setIsInput(false);
        }
    }

    // const addNoteToDb=async (id,noteTitle,noteText,index)=>{
    //     await setDoc(doc(db,"NoteList",id),{id,noteTitle,noteText,index})
    // }
    const handleSaveNoteToDb=async ()=>{
        const id =v4();
        // const index=setList.length;
        // const{noteTitle,noteText}=debouncedText;
        addData((prev)=>[{id,noteTitle,noteText},...prev]);
        console.log(id,noteTitle,noteText);
        await saveNoteData(id,noteTitle,noteText);
        setNoteText("");
        setNoteTitle("");

    }


    //此useEffect用來確認title & text是否正在輸入或輸入完成
    useEffect(()=>{

        if(!debouncedText){//阻止第一次effect
            return
        }
        if(isInput){//檢查是否正在輸入title或text，設定callback
            document.addEventListener("click",handleClickOutofTarget)
            console.log("typing")
        }else{//若無typing則執行以下
            document.removeEventListener("click",handleClickOutofTarget);//若非typing狀態則移除handleClickOutofTarget
            handleSaveNoteToDb();//存入db
        }
    },[isInput])
    useEffect(()=>{//若noteItle跟noteText有值的變動，則執行以下動作
        if(!noteTitle && !noteText){//阻止第一次的useEffect
            return
        }
        console.log("usingEffect");      
        setDebouncedText({noteTitle,noteText})
        setIsInput(true);
    },[noteTitle,noteText])

    return(
        <>
        <NoteTitleInput ref={typingTitleRef}  value={noteTitle} onChange={getNodeTitleValue}></NoteTitleInput>
        <NoteTextInput ref={typingTextRef} value={noteText} onChange={getNodeTextValue}  ></NoteTextInput>
        <CanvasTool   noteTitle={noteTitle} noteText={noteText} />
        </>
    )

}





export default NoteEdit