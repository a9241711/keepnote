import { useState } from "react";
import styled from "styled-components";
import { LargerAnimate,NoteTitleInput,NoteTextInput,Media_Query_SM, IconDiv } from "../../../components/constant";
import { CanvasToolMb } from "../CanvasTool";
import { NotificationDeleteEdit } from "../notification/NotificationDelete";
import { Plus } from "../../../assets";

const NoteListEditDiv=styled.div`
    background-color: transparent;
    border: none;
    padding: 0;
    position: fixed;
    width: fit-content;
    top: 0;
    right: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 4001;
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    animation: ${LargerAnimate} 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    ${Media_Query_SM}{
        display: flex;
    }
`
const NoteListEditBm=styled.div`
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 100px;
    display: none;
    z-index: 500;
    background-color: #FFFFFF;
    ${Media_Query_SM}{
        display: flex;
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
const NoteEditAdd=styled(IconDiv)`
        display: none;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url(${Plus}) ;
        ${ Media_Query_SM}{display:block};
`
const NoteEditMb=({isFilter,noteColor,uid,noteTitle,noteText,setNoteColor,getNodeTitleValue,getNodeTextValue,isFromEdit,setIsFromEdit,notification,setNotification,setIsClose})=>{//For mobile
    const[isClickEdit,setIsClickEdit]=useState(false)
    
    return(
        <>
        {isClickEdit? 
            <>
            <NoteListEditDiv isFilter={isFilter} style={{backgroundColor: noteColor}} noteColor={noteColor}>
            <NoteTitleInputDiv style={{backgroundColor: noteColor}} value={noteTitle} onChange={getNodeTitleValue} ></NoteTitleInputDiv>
            <NoteTextInputDiv style={{backgroundColor: noteColor}}  value={noteText} onChange={getNodeTextValue}  ></NoteTextInputDiv>
            <NotificationDeleteEdit isFromEdit={isFromEdit} setIsFromEdit={setIsFromEdit} notification={notification} setNotification={setNotification} />
            <CanvasToolMb setIsClose={setIsClose} setNotification={setNotification} setIsFromEdit={setIsFromEdit} isFromEdit={isFromEdit} setNoteColor={setNoteColor} noteColor={noteColor}  noteTitle={noteTitle} noteText={noteText} uid={uid} notification={notification}/>     
            </NoteListEditDiv> 
            </>
            
        :<NoteListEditBm>
            <NoteEditAdd onClick={()=>setIsClickEdit(true)}></NoteEditAdd>
            <CanvasToolMb setIsClose={setIsClose} setNotification={setNotification} setIsFromEdit={setIsFromEdit} isFromEdit={isFromEdit} setNoteColor={setNoteColor} noteColor={noteColor}  noteTitle={noteTitle} noteText={noteText} uid={uid} notification={notification}/>     
        </NoteListEditBm>
        }
        </>
    )


}

export default NoteEditMb;