import { useEffect, useState,useRef } from "react";
import styled from "styled-components";
import {NoteTitleInput,NoteTextInput} from "../../components/constant"
import { v4 } from "uuid";
import { db } from "../../store/firebase";
import { collection,addDoc, setDoc,doc } from "firebase/firestore";
import { saveNoteData } from "../../store/HandleDb";
import CanvasTool from "./CanvasTool";



const NoteEdit=({addData,uid,setDataChanged})=>{
    const[noteTitle,setNoteTitle]=useState("");
    const[noteText,setNoteText]=useState("");
    const[isInput,setIsInput]=useState(false);//檢查是否仍在輸入
    const[titleClick,setTitleClick] =useState(false);//檢查是否點擊title
    const[debouncedText,setDebouncedText]=useState("");//控制取得typying title text資料
    const typingTitleRef=useRef();
    const typingTextRef=useRef();

    //auto height 輸入框
    //控制修改文字框的height
    const handleAutoHeight=(e)=>{
      e.target.style.height=e.target.scrollHeight + "px"
    }

    const getNodeTitleValue=(e)=>{
        setNoteTitle(e.currentTarget.value);
        handleAutoHeight(e);
    }

    const getNodeTextValue=(e)=>{
        setNoteText(e.currentTarget.value);
        handleAutoHeight(e);
    }

    const handleClickOutofTarget=(e)=>{//檢查是否點到輸入框以外，是或否都改變isinput狀態
        if(!typingTitleRef.current.contains(e.target) && !typingTextRef.current.contains(e.target)){
            setIsInput(false);
            setTitleClick(false);
        }
    }


    const handleSaveNoteToDb=async ()=>{
        const id =v4();
        // const index=setList.length;
        const{noteTitle,noteText}=debouncedText;
        // addData((prev)=>[{id,noteTitle,noteText},...prev]);
        setDebouncedText("")
        await saveNoteData(id,noteTitle,noteText,uid);
        setDataChanged(true)
    }
    //此useEffect用來確認是否click title 秀出完整框
    useEffect(()=>{
        if(!titleClick) return
        if(titleClick){
            document.addEventListener("click",handleClickOutofTarget);
            console.log("clicking");
        }
        return () =>{document.removeEventListener("click",handleClickOutofTarget);} 
        
    },[titleClick])

    //此useEffect用來確認title & text是否正在輸入或輸入完成
    useEffect(()=>{
        if(!debouncedText){//阻止第一次effect
            return
        }
        if(isInput){//檢查是否正在輸入title或text，設定callback
            document.addEventListener("click",handleClickOutofTarget);
            console.log("typing");
        }else{ 
            handleSaveNoteToDb();//存入db
            setNoteText("");
            setNoteTitle("");}
         return () =>{document.removeEventListener("click",handleClickOutofTarget);} //移除handleClickOutofTarget
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
        <NoteTitleInput ref={typingTitleRef}  value={noteTitle} onChange={getNodeTitleValue} onClick={()=> setTitleClick(true)} ></NoteTitleInput>
        {titleClick
        ? <NoteTextInput ref={typingTextRef} value={noteText} onChange={getNodeTextValue}  ></NoteTextInput> :null}
        <CanvasTool  noteTitle={noteTitle} noteText={noteText} uid={uid}/>

        </>
    )

}





export default NoteEdit