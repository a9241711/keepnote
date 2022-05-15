import { useState,useRef,useEffect, useContext } from "react";
import styled from "styled-components";
import NoteItem from "./NoteItem";
import { v4 } from "uuid";
import { updateListsPosition } from "../../store/HandleDb";
import { Media_Query_MD, Media_Query_SM,LargerAnimate,IconDiv } from "../../components/constant";
import NoteTool from "./NoteTool";
import NoteBgColor from "./color/NoteBgColor";
import NotificationPop from "./notification/NotificationPop";
import { getMessaging,onMessage } from "firebase/messaging";
import NoteInput from "./NoteInput";
import NoteColor from "./color/NoteColor";
import NoteModiBtn from "./modify/NoteModiBtn";
import { EditBoard } from "../../assets";
import NotificationDelete from "./notification/NotificationDelete";
import { Link } from "react-router-dom";
import NotificationIndex from "./notification/NotificationIndex";
import NoteContext from "../context/NoteContext";
import NoteModifyArea from "./modify/NoteModifyArea";

const NoteListsDiv=styled.div`//List Content Div
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4,1fr);
    column-gap:10px;
    align-items: start;
    ${Media_Query_MD}{
        grid-template-columns: repeat(2,1fr);
    }
    ${Media_Query_SM}{
        grid-template-columns: 1fr;
    }
`
const NoteIconDiv=styled.div`//Tool Div
    width: 100%;
    display:flex;
    align-items: center;
    justify-content: flex-start;
    visibility: ${props=>{return props.isClickTool? "visible":"hidden"}};
    position:relative;
    padding: 10px;
    box-sizing: border-box;
`
const NoteLists=styled.div`//draggable的Div
    width:100%;
    box-sizing: border-box;
    height:auto;
    margin: 20px 0;
    transition: all ease-in 0.2s;
    position: relative;
    border-radius: 8px;
    &:hover{
        box-shadow: 0 1px 2px 0 rgb(60 64 67/50%), 0 2px 6px 2px rgb(60 64 67 /30%);
    }
    &:hover ${NoteIconDiv}{
        opacity: 1;
        visibility: visible;
    }
    &:active ${NoteIconDiv}{
        visibility: hidden;
    }
`

const NoteListCol=styled.div`
    background: #ffffff;
`

const NoteList=({setDataChanged,setList,uid,updateData})=>{
            const[isDragged,setIsDragged]=useState(false);//拖曳
            const[isClickTool,setIsClickTool]=useState(false);//是否點擊Tool div
            const [selected, setSelected] = useState(false);//是否點擊特定貼文
            const dragOverItem=useRef();//拖曳進入的位置
            const dragItem=useRef();//設定被拖曳的position位置
            const draggedItem=useRef();//用來觀察被拖曳的item
            const[popValue,setPopValue]=useState("");//notificaiton通知value設定
            const[isNotification,setIsNotification]=useState(false);//檢查是否有通知，onMessage使用


//    async function handleDragEnd(result){
//         if(!result.destination) return;
//         const sourceIndex=result.source.index;
//         const destinationIndex=result.destination.index;
//         const [reorderItem]= setList.splice(sourceIndex,1);//取出要換位置的item
//         setList.splice(destinationIndex,0,reorderItem);//更新更動位置後的物件
//         const setListCopy= setList.map((item,index)=> ({...item,index:index}));
//             //讀取文件Id
//         // const updateToDb=doc(db,"NoteList",id);//這裡id要改成會員id
//         // await updateDoc(updateToDb,setListCopy);
//         updateData(setListCopy);
//     }

    const getItemStyle=(isDragging,draggableStyle)=>({
        userSelect:"none",
        boxShadow:isDragging?'0 0 .2rem #666':"none",
        //預設需要加入
        ...draggableStyle
    })
    const handleDragStart=(e,position)=>{
        //使用ref設定被拖曳的對象
        dragItem.current=position;
        draggedItem.current.style.boxShadow="rgb(65 69 73 / 30%) 0px 1px 1px 0px,rgb(65 69 73 / 15%) 0px 1px 3px 1px;"
      } 
    const handleDragEnd=(e)=>{
        // console.log("dragEnd",e.target.parentNode)
      }

    const dragOver=(e)=>{
        e.preventDefault();
        e.currentTarget.style.border="1px solid black";
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
        // setDraggedItem(false);
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
        e.currentTarget.style.board="none";
    }

    useEffect(()=>{
        if(!isDragged)return//若無拖曳移動則不執行
        async function upDateListToDb(setList,uid){
           await updateListsPosition(setList,uid)
        }
        upDateListToDb(setList,uid)
        setIsDragged(false);//執行後設定回初始狀態
    },[isDragged])
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
        <NoteListsDiv>
            <NoteListCol className="status" onDrop={dragDrop}>
            { 
            setList.map((item,index)=>{
                if(index %4 ===0){
                    const{id,noteText,noteTitle,image,time,color,whenToNotify=""}=item;
                    console.log(whenToNotify)
                    const board=item.board;
                    const key=v4();
                    return( <NoteLists  key={id} ref={draggedItem} onDragLeave={dragLeave} onDragOver={dragOver} id={id} onDragEnter={(e)=>dragEnter(e,index)}  draggable={true}  onDragStart={(e)=>handleDragStart(e,index)} onDragEnd={handleDragEnd}>
                            <NoteBgColor id={id}  color={color}/>
                            <NoteItem whenToNotify={whenToNotify}  setSelected={setSelected}  setDataChanged={setDataChanged}   board={board} key={id} id={id} noteText={noteText} noteTitle={noteTitle} image={image} setList={setList}  uid={uid}/>                             
                            <NoteIconDiv isClickTool={isClickTool}>
                            <NoteTool  setList={setList} setIsClickTool={setIsClickTool} id={id} uid={uid} setDataChanged={setDataChanged} noteText={noteText} noteTitle={noteTitle}  />
                            </NoteIconDiv>
                            </NoteLists>
                            )
                }
            })}</NoteListCol>
            <NoteListCol className="status"   onDrop={dragDrop}>
            { 
            setList.map((item,index)=>{
                if(index %4 ===1){
                    const{id,noteText,noteTitle,image,time,color,whenToNotify=""}=item;
                    const board=item.board;
                    const key=v4();
                    return( <NoteLists  key={id} ref={draggedItem} onDragLeave={dragLeave} onDragOver={dragOver} id={id} onDragEnter={(e)=>dragEnter(e,index)}  draggable={true}  onDragStart={(e)=>handleDragStart(e,index)} onDragEnd={handleDragEnd}>
                            <NoteBgColor id={id}  color={color}/>
                            <NoteItem whenToNotify={whenToNotify}   setSelected={setSelected}  setDataChanged={setDataChanged}   board={board} key={id} id={id} noteText={noteText} noteTitle={noteTitle} image={image} setList={setList}  uid={uid}/>                             
                            <NoteIconDiv isClickTool={isClickTool}>
                            <NoteTool setList={setList} setIsClickTool={setIsClickTool} id={id} uid={uid} setDataChanged={setDataChanged} noteText={noteText} noteTitle={noteTitle}  />
                            </NoteIconDiv>
                            </NoteLists>
                            )
                }
            })}
            </NoteListCol>
            <NoteListCol className="status"   onDrop={dragDrop}>
            { 
            setList.map((item,index)=>{
                if(index %4 ===2){
                    const{id,noteText,noteTitle,image,time,color,whenToNotify=""}=item;
                    const board=item.board;
                    const key=v4();
                    return( <NoteLists  key={id} ref={draggedItem} onDragLeave={dragLeave} onDragOver={dragOver} id={id} onDragEnter={(e)=>dragEnter(e,index)}  draggable={true}  onDragStart={(e)=>handleDragStart(e,index)} onDragEnd={handleDragEnd}>
                            <NoteBgColor id={id}  color={color}/>
                            <NoteItem whenToNotify={whenToNotify}   setSelected={setSelected}  setDataChanged={setDataChanged}   board={board} key={id} id={id} noteText={noteText} noteTitle={noteTitle} image={image} setList={setList}  uid={uid}/>                             
                            <NoteIconDiv isClickTool={isClickTool}>
                            <NoteTool  setList={setList} setIsClickTool={setIsClickTool} id={id} uid={uid} setDataChanged={setDataChanged} noteText={noteText} noteTitle={noteTitle}  />
                            </NoteIconDiv>
                            </NoteLists>
                            )
                }
            })}
            </NoteListCol>
            <NoteListCol className="status"  onDrop={dragDrop}>
            { 
            setList.map((item,index)=>{
                if(index %4 ===3){
                    const{id,noteText,noteTitle,image,time,color,whenToNotify=""}=item;
                    const board=item.board;
                    const key=v4();
                    return( <NoteLists  key={id} ref={draggedItem} onDragLeave={dragLeave} onDragOver={dragOver} id={id} onDragEnter={(e)=>dragEnter(e,index)}  draggable={true}  onDragStart={(e)=>handleDragStart(e,index)} onDragEnd={handleDragEnd}>
                            <NoteBgColor id={id}  color={color}/>
                            <NoteItem whenToNotify={whenToNotify}   setSelected={setSelected}  setDataChanged={setDataChanged}   board={board} key={id} id={id} noteText={noteText} noteTitle={noteTitle} image={image} setList={setList}  uid={uid}/> 
                            <NoteIconDiv isClickTool={isClickTool}>
                            <NoteTool  setList={setList} setIsClickTool={setIsClickTool} id={id} uid={uid} setDataChanged={setDataChanged} noteText={noteText} noteTitle={noteTitle}  />
                            </NoteIconDiv>
                            </NoteLists>
                            )
                }
            })}
            </NoteListCol>

            {selected ? <NoteModifyArea uid={uid} selected={selected} setSelected={setSelected}  setDataChanged={setDataChanged} />
                 : null}
                {isNotification?<NotificationPop  setSelected={setSelected}  popValue={popValue} setList={setList} setIsNotification={setIsNotification}/>:null}
            </NoteListsDiv>
            )
}       
// {
//     setList.map((item)=>{
//         console.log(setList.length,item[0],item)
//         const{id,noteText,noteTitle,image}=item;
//         const board=item.board;
//         const key=v4();
//         return( <NoteLists key={key}  draggable={true}  onDrag={handleDragStart} onDragEnd={handleDragEnd}>
//                 {/* { board ?<BoardItem  key={key}  board={board} /> : null } */}
//                 <NoteItem    board={board} key={id} id={id} noteText={noteText} noteTitle={noteTitle} image={image} setList={setList} addData={addData} deleteData={deleteData} updateData={updateData} uid={uid}/> 
//                 </NoteLists>
//                 )
//     })
//     }
        // <DragDropContext onDragEnd={handleDragEnd}>
        //     <Droppable droppableId="noteLists" direction="horizontal">
        //         {(provided,snapshot)=>(
        //         <NoteListsDiv  {...provided.droppableProps} ref={provided.innerRef} style={{...provided.droppableProps.style,background:snapshot.isDraggingOver?"lightblue":"lightgrey"}}>
        //     {
        //     setList.map((item)=>{
        //         const{id,index,noteText,noteTitle}=item;
        //         return(  <Draggable key={id} draggableId={id} index={index}>
        //                 {(provided,snapshot)=>(
        //                 <DragDiv ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging,provided.draggableProps.style)} >
        //                 <NoteItem  index={index} key={id} id={id} noteText={noteText} noteTitle={noteTitle} setList={setList} addData={addData} deleteData={deleteData} updateData={updateData}/> 
        //                 </DragDiv>
        //                 )}
        //                 </Draggable>
        //                 )
        //     })
        // }   
        // {provided.placeholder}
        //     </NoteListsDiv>
        //     )}
        // </Droppable>
        // </DragDropContext>





export default NoteList