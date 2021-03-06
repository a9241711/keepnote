import { useState,useRef,useEffect, useContext } from "react";
import styled from "styled-components";
import NoteItem from "./NoteItem";
import { Media_Query_MD, Media_Query_SM,Media_Query_SMD,Media_Query_LG } from "../../components/constant";
import NoteTool from "./NoteTool";
import NoteBgColor from "./color/NoteBgColor";
import NotificationPop from "./notification/NotificationPop";
import { getMessaging,onMessage } from "firebase/messaging";
import NoteModifyArea from "./modify/NoteModifyArea";
import Masonry from 'react-masonry-css';
import SearchContext from "../../header/components/SearchContext";
import NoteDragMb from "./drag/NoteDragMb";
import { updateListsPosition } from "../../store/handledb/NoteDb";


const NoteListsDiv=styled.div`//List Content Div
    width: 100%;
    margin-bottom: 45px;
`
const NoteListCol=styled(Masonry)`
    &.my-masonry-grid{  
    display: flex;
    margin: 20px auto;
    box-sizing: border-box;
    justify-content: flex-start;
    }            
    &.my-masonry-grid >.my-masonry-grid_column{
    margin: 0 10px;
    ${Media_Query_SMD}{
        display: none;
    }
    ${Media_Query_SM}{
       display: none;
    }
    }       
`
const NoteIconDiv=styled.div`
    width: 100%;
    display:flex;
    align-items: center;
    justify-content: flex-start;
    opacity:0;
    visibility:"hidden";
    transition:visibility 0.3s linear,opacity 0.3s linear;
    position:relative;
    padding: 10px;
    box-sizing: border-box;
`

const NoteLists=styled.div`
    width: 250px;
    box-sizing: border-box;
    height:auto;
    margin: 10px 0;
    transition: all ease-in 0.2s;
    position: relative;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    ${Media_Query_MD}{
        width: 100%;
    }
    ${Media_Query_SMD}{
        width:100%;
    }
    ${Media_Query_SM}{
        width: 100%;
    }
    ${Media_Query_LG}{
        &:hover{
        transition: all ease-in-out .3s ;
        box-shadow: 0 1px 2px 0 rgb(60 64 67/50%), 0 2px 6px 2px rgb(60 64 67 /30%);
        }
        &:hover ${NoteIconDiv}{
            opacity:1;
            visibility:"visible";
        }
    }
`


const NoteList=({isDataChange,setDataChanged,setList,uid,userEmail,updateData,setIsArchive})=>{
        const[isDragged,setIsDragged]=useState(false);//??????
        const[selected, setSelected] = useState(false);//????????????????????????
        const[clickTool,setClickTool]=useState(false);//????????????tool
        const dragOverItem=useRef();//?????????????????????
        const dragItem=useRef();//??????????????????position??????
        const draggedItem=useRef();//????????????????????????item
        const[popValue,setPopValue]=useState("");//notificaiton??????value??????
        const[isNotification,setIsNotification]=useState(false);//????????????????????????onMessage??????
        const{filterData,dataList,filterButDataChange}=useContext(SearchContext);
        const{filterDataList,isFilter}=filterData;
        const originDataList= dataList["dataList"];//???????????????


    const handleDragStart=(e,position)=>{
        //??????ref????????????????????????
        e.dataTransfer.effectAllowed = "move";
        dragItem.current=position;
        draggedItem.current.style.boxShadow="rgb(65 69 73 / 30%) 0px 1px 1px 0px,rgb(65 69 73 / 15%) 0px 1px 3px 1px;"
    } 

    const dragOver=(e)=>{
        e.preventDefault();
        e.currentTarget.style.border="2px dashed black";
        e.dataTransfer.dropEffect="move";
    }
    const dragEnter=(e,position)=>{
        dragOverItem.current=position;
    }
    const dragLeave=(e)=>{
        e.currentTarget.style.border="none";
    }
    const dragDrop=(e)=>{
        draggedItem.current.style.boxShadow="none;"
        //????????????
        const setListCopy=[...setList];//????????????lists;
        const dragedItem=setListCopy[dragItem.current];//???????????????item??????;
        setListCopy.splice(dragItem.current,1);//???????????????item??????
        setListCopy.splice(dragOverItem.current,0,dragedItem);//????????????????????????????????????item
        updateData(setListCopy);//??????setList??????
        setIsDragged(true);//?????????????????????
        //??????DB
        dragItem.current=null;//??????ref??????
        dragOverItem.current=null;
        e.currentTarget.style.board="1px solid #e0e0e0";
    }

    useEffect(()=>{
        if(!isDragged)return//??????????????????????????????
        async function upDateListToDb(setList,uid){
           await updateListsPosition(setList,uid)
        }
        upDateListToDb(setList,uid)
        setIsDragged(false);//??????????????????????????????
    },[isDragged]);

    useEffect(()=>{
        if(isFilter){
        updateData(filterDataList);
        }else{
        updateData(originDataList);
        };
    },[isFilter,filterButDataChange])

    //??????pop up notification message
    const messaging = getMessaging();//????????????push nitification???????????????messsaging?????????nitificationPop
    onMessage(messaging, (payload) => {
        const {title,body,time,id}=payload.data;
        captureNotif(time,id,title,body);
    });
    const captureNotif =(time,id,title,body)=>{
        setIsNotification(true);
        setPopValue({title,body,time,id});
    }

    return(
        <>
        <NoteListsDiv>
            <NoteListCol breakpointCols={{default:4, 1023:3,769:3, }} className="my-masonry-grid" columnClassName="my-masonry-grid_column" onDrop={dragDrop}>
            { 
            setList.map((item,index)=>{
                    const{id,noteText,noteTitle,image,time,color,whenToNotify="",permissionEmail,owner,targetEmail}=item;
                    const board=item.board;
                    return( <NoteLists clickTool={clickTool} key={id} ref={draggedItem} onDragLeave={dragLeave} onDragOver={dragOver} id={id} onDragEnter={(e)=>dragEnter(e,index)}  draggable={true}  onDragStart={(e)=>handleDragStart(e,index)}>
                                <NoteBgColor id={id}  color={color}/>
                                <NoteItem whenToNotify={whenToNotify}  setSelected={setSelected}  setDataChanged={setDataChanged}   board={board} key={id} id={id} noteText={noteText} noteTitle={noteTitle} image={image} setList={setList}  uid={uid} permissionEmail={permissionEmail}owner={owner}targetEmail={targetEmail} userEmail={userEmail}/>                             
                                <NoteIconDiv  >
                                <NoteTool setIsArchive={setIsArchive} setClickTool={setClickTool} setList={setList}  id={id} uid={uid} userEmail={userEmail} setDataChanged={setDataChanged} noteText={noteText} noteTitle={noteTitle}  permissionEmail={permissionEmail}owner={owner}targetEmail={targetEmail} image={image} board={board}/>
                                </NoteIconDiv>
                            </NoteLists>
                            )
            })}  
            </NoteListCol>
            <NoteDragMb setIsDragged={setIsDragged} setSelected={setSelected}  setDataChanged={setDataChanged}setList={setList}uid={uid}updateData={updateData} userEmail={userEmail}/>
            {selected 
            ? <NoteModifyArea setIsArchive={setIsArchive} isDataChange={isDataChange} setDataChanged={setDataChanged} uid={uid} selected={selected} setSelected={setSelected}   userEmail={userEmail}/>
            : null}
            {isNotification
            ?<NotificationPop  setSelected={setSelected}  popValue={popValue} setList={setList} setIsNotification={setIsNotification}/>
            :null}
        </NoteListsDiv>
        </>
        )
}       

export default NoteList