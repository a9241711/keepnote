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
        const[isDragged,setIsDragged]=useState(false);//拖曳
        const[selected, setSelected] = useState(false);//是否點擊特定貼文
        const[clickTool,setClickTool]=useState(false);//是否點擊tool
        const dragOverItem=useRef();//拖曳進入的位置
        const dragItem=useRef();//設定被拖曳的position位置
        const draggedItem=useRef();//用來觀察被拖曳的item
        const[popValue,setPopValue]=useState("");//notificaiton通知value設定
        const[isNotification,setIsNotification]=useState(false);//檢查是否有通知，onMessage使用
        const{filterData,dataList,filterButDataChange}=useContext(SearchContext);
        const{filterDataList,isFilter}=filterData;
        const originDataList= dataList["dataList"];//取得原資料


    const handleDragStart=(e,position)=>{
        //使用ref設定被拖曳的對象
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
        //更新畫面
        const setListCopy=[...setList];//取得所有lists;
        const dragedItem=setListCopy[dragItem.current];//取得被拖曳item的值;
        setListCopy.splice(dragItem.current,1);//刪掉被拖曳item的值
        setListCopy.splice(dragOverItem.current,0,dragedItem);//在插入的位置加上被拖曳的item
        updateData(setListCopy);//更新setList狀態
        setIsDragged(true);//已經拖曳移動過
        //更新DB
        dragItem.current=null;//清空ref資料
        dragOverItem.current=null;
        e.currentTarget.style.board="1px solid #e0e0e0";
    }

    useEffect(()=>{
        if(!isDragged)return//若無拖曳移動則不執行
        async function upDateListToDb(setList,uid){
           await updateListsPosition(setList,uid)
        }
        upDateListToDb(setList,uid)
        setIsDragged(false);//執行後設定回初始狀態
    },[isDragged]);

    useEffect(()=>{
        if(isFilter){
        updateData(filterDataList);
        }else{
        updateData(originDataList);
        };
    },[isFilter,filterButDataChange])

    //處理pop up notification message
    const messaging = getMessaging();//前端取得push nitification通知，監聽messsaging，傳入nitificationPop
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