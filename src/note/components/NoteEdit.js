import { useEffect, useState,useRef,useContext } from "react";
import styled from "styled-components";
import {NoteTitleInput,NoteTextInput,Media_Query_MD,Media_Query_SM,Media_Query_SMD} from "../../components/constant"
import { v4 } from "uuid";
import { requestForToken, saveNoteData } from "../../store/HandleDb";
import CanvasTool from "./CanvasTool";
import  { NotificationDeleteEdit } from "./notification/NotificationDelete";
import SearchContext from "../../header/components/SearchContext";
import NoteEditMb from "./edit/NoteEditMb";
import { NoteModiEditBtn } from "./modify/NoteModiBtn";

const NoteDiv=styled.div`
    width: 50%;
    position:relative;
    box-sizing:border-box;
    box-shadow:0 1px 2px 0 rgb(60 64 67/30%), 
    0 2px 6px 2px rgb(60 64 67 /15%);
    border-radius:8px;
    margin-top:33px;
    padding: 10px;
    background-color: #ffffff;
    flex-direction: column;
    display: ${props=> props.isFilter?"none":"flex"};
    ${Media_Query_SMD}{
        width: 60%;
    }
  ${Media_Query_MD}{
        width: 50%;
    }
    ${Media_Query_SM}{
        width: 80%;
    }
`
const NoteTitleInputDiv=styled(NoteTitleInput)`
    height: 22px;
    line-height: 22px;
`
const NoteTextInputDiv=styled(NoteTextInput)`
    height: 22px;
    line-height: 22px;
`
const NoteEditTool=styled.div`
    display: flex;
    justify-content: space-between;
`

const NoteEdit=({addData,uid,setDataChanged})=>{
    const[noteTitle,setNoteTitle]=useState("");
    const[noteText,setNoteText]=useState("");
    const[noteColor,setNoteColor]=useState("#FFFFFF");
    const[notification,setNotification]=useState("");
    const[isFromEdit,setIsFromEdit]=useState(true);
    const[isInput,setIsInput]=useState(false);//檢查是否仍在輸入
    const[titleClick,setTitleClick] =useState(false);//檢查是否點擊title
    const[debouncedText,setDebouncedText]=useState("");//控制取得typying title text資料
    const[isClose,setIsClose]=useState(false);//檢查是否按關閉
    const typingTitleRef=useRef();
    const typingTextRef=useRef();
    const{filterData}=useContext(SearchContext);//取得所有filter data
    const{isFilter}=filterData;

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
        const{noteTitle,noteText}=debouncedText;
        setDebouncedText("");
        console.log(typeof notification!="undefined")
        if(typeof notification!="undefined" && notification===null){
            const{timer,currentToken}=notification;
            await saveNoteData(id,noteTitle,noteText,uid,noteColor,timer,currentToken);
            setIsClose(true);
            setDataChanged(true);
            setIsInput(false);
        }
        else{
            const timer=""; 
            const currentToken="";
            await saveNoteData(id,noteTitle,noteText,uid,noteColor,timer,currentToken);
            console.log(timer,currentToken);
            setIsClose(true);
            setDataChanged(true);
            setIsInput(false);
        }
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
      }
         return () =>{document.removeEventListener("click",handleClickOutofTarget);} //移除handleClickOutofTarget
    },[isInput])
    useEffect(()=>{//若noteItle跟noteText有值的變動，則執行以下動作
        if(!noteTitle && !noteText){//阻止第一次的useEffect
            return
        } 
        setDebouncedText({noteTitle,noteText})
        setIsInput(true);
    },[noteTitle,noteText])

    useEffect(()=>{//是否按下關閉，是則清空內容
        if(!isClose)return 
        setTitleClick(false);
        setNoteTitle("");
        setNoteText("");
        setNoteColor("#FFFFFF");
        setNotification("");
        setIsClose(false);
    },[isClose])

    return(
        <>
        {/* 桌機+平版 */}
        <NoteDiv isFilter={isFilter} style={{backgroundColor: noteColor}} noteColor={noteColor} ref={typingTitleRef}>
        <NoteTitleInputDiv style={{backgroundColor: noteColor}} value={noteTitle} onChange={getNodeTitleValue} onClick={()=> setTitleClick(true)} ></NoteTitleInputDiv>
        {titleClick
        ? <NoteTextInputDiv style={{backgroundColor: noteColor}} ref={typingTextRef} value={noteText} onChange={getNodeTextValue}  ></NoteTextInputDiv> :null}
        <NotificationDeleteEdit isFromEdit={isFromEdit} setIsFromEdit={setIsFromEdit} notification={notification} setNotification={setNotification} />
        <NoteEditTool>
        <CanvasTool setIsClose={setIsClose} setNotification={setNotification} setIsFromEdit={setIsFromEdit} isFromEdit={isFromEdit} setNoteColor={setNoteColor} noteColor={noteColor} titleClick={titleClick} noteTitle={noteTitle} noteText={noteText} uid={uid} notification={notification}/>
        {titleClick
        ?<NoteModiEditBtn handleSaveNoteToDb={handleSaveNoteToDb} setIsClose={setIsClose}/>:null}
        </NoteEditTool>
        </NoteDiv>
        {/* <NoteEditMb uid={uid}noteTitle={noteTitle}noteText={noteText}getNodeTitleValue={getNodeTitleValue}getNodeTextValue={getNodeTextValue}setNoteColor={setNoteColor} isFromEdit={isFromEdit}setIsFromEdit={isFromEdit}notification={notification}setNotification={setNotification}setIsClose={setIsClose}/> */}
        
        </>
    )

}





export default NoteEdit