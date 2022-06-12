import { useEffect, useState,useRef,useContext } from "react";
import styled from "styled-components";
import {NoteTitleInput,NoteTextInput,Media_Query_MD,Media_Query_SM,Media_Query_SMD} from "../../components/constant"
import { v4 } from "uuid";
import { saveNoteData } from "../../store/HandleDb";
import  { NotificationDeleteEdit } from "./notification/NotificationDelete";
import SearchContext from "../../header/components/SearchContext";
import NoteEditMb from "./edit/NoteEditMb";
import { NoteModiEditBtn } from "./modify/NoteModiBtn";
import HeaderLoadContext from "../../header/HeaderLoadContext";
import { NoteEditTool } from "./NoteTool";

const NoteDiv=styled.div`
    width: 50%;
    position:relative;
    box-sizing:border-box;
    box-shadow:0 1px 2px 0 rgb(60 64 67/30%), 
    0 2px 6px 2px rgb(60 64 67 /15%);
    border-radius:8px;
    margin-top:33px;
    padding: 5px 10px;
    background-color: #ffffff;
    flex-direction: column;
    display: ${props=> props.isFilter?"none":"flex"};
    ${Media_Query_SMD}{
        display: none;
    }
    ${Media_Query_MD}{
        display: none;
    }
    ${Media_Query_SM}{
        /* width: 80%; */
        display: none;
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
const PermissionNotifiDiv=styled.div`//permission and notification shows div
    display: ${props=>{return props.titleClick?"flex":"none"}};
    flex-wrap:wrap;
    align-items: center;
    padding:0 10px;
`
const NoteEditToolDiv=styled.div`
    display: flex;
    justify-content: space-between;
`

const NoteEdit=({uid,setDataChanged,userEmail})=>{
    const[noteTitle,setNoteTitle]=useState("");
    const[noteText,setNoteText]=useState("");
    const[noteColor,setNoteColor]=useState("#FFFFFF");
    const[notification,setNotification]=useState(1);
    const[emailList,setEmailList]=useState([]);
    const[isFromEdit,setIsFromEdit]=useState(true);
    const[isInput,setIsInput]=useState(false);//檢查是否仍在輸入
    const[titleClick,setTitleClick] =useState(false);//檢查是否點擊title
    const[debouncedText,setDebouncedText]=useState("");//控制取得typying title text資料
    const[isClose,setIsClose]=useState(false);//檢查是否按關閉
    const typingTitleRef=useRef();
    const typingTextRef=useRef();
    const{filterData}=useContext(SearchContext);//取得所有filter data
    const{isFilter}=filterData;
    const{setIsLoading}=useContext(HeaderLoadContext);

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
        if(e.target.classList.contains("close") ||e.target.classList.contains("confirm"))return;//for  close and confrim icon
        else if(!typingTitleRef.current.contains(e.target) ){
            setTitleClick(false);
        }
    }

    const handleSaveNoteToDb=async ()=>{
        setIsLoading(true);
        const id =v4();
        const{noteTitle,noteText}=debouncedText;
        setDebouncedText("");
        if(notification!==1){
            const{timer,currentToken}=notification;
            await saveNoteData(id,noteTitle,noteText,uid,noteColor,timer,currentToken,emailList);
            setIsClose(true);
            setDataChanged(true);
            setIsInput(false);
        }
        else{
            const timer=1; 
            const currentToken=1;
            await saveNoteData(id,noteTitle,noteText,uid,noteColor,timer,currentToken,emailList);
            setIsClose(true);
            setDataChanged(true);
            setIsInput(false);
        }
        setIsLoading(false);
    }
    //此useEffect用來確認是否click title 秀出完整框
    useEffect(()=>{
        if(!titleClick) return
        document.addEventListener("click",handleClickOutofTarget);
        return () =>{document.removeEventListener("click",handleClickOutofTarget);}   
    },[titleClick])


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
        setNotification(1);
        setEmailList([]);
        setIsClose(false);
    },[isClose])

    return(
        <>
        {/* 桌機 */}
        <NoteDiv isFilter={isFilter} style={{backgroundColor: noteColor}} noteColor={noteColor} ref={typingTitleRef}>
            <NoteTitleInputDiv   style={{backgroundColor: noteColor}} value={noteTitle} onChange={getNodeTitleValue} onClick={()=> setTitleClick(true)} ></NoteTitleInputDiv>
            {titleClick
            ? <NoteTextInputDiv style={{backgroundColor: noteColor}} value={noteText} onChange={getNodeTextValue}  ></NoteTextInputDiv> :null}
            <PermissionNotifiDiv titleClick={titleClick}>
                <NotificationDeleteEdit isFromEdit={isFromEdit} setIsFromEdit={setIsFromEdit} notification={notification} setNotification={setNotification} />
                <PermissionItemEdit permissionEmail={emailList}/>
            </PermissionNotifiDiv>
            <NoteEditToolDiv >
                <NoteEditTool  setIsClose={setIsClose} setNotification={setNotification} isFromEdit={isFromEdit} setNoteColor={setNoteColor} noteColor={noteColor} titleClick={titleClick} noteTitle={noteTitle} noteText={noteText} uid={uid}userEmail={userEmail}setEmailList={setEmailList} emailList={emailList}notification={notification}/>
                {titleClick
                ?<NoteModiEditBtn handleSaveNoteToDb={handleSaveNoteToDb} setIsClose={setIsClose}/>:null}
            </NoteEditToolDiv>
        </NoteDiv>
        <NoteEditMb uid={uid} setDataChanged={setDataChanged} userEmail={userEmail}/> 
        </>
    )

}


export default NoteEdit