import { useState,useRef,useEffect } from "react";
import styled from "styled-components";
import NoteItem from "./NoteItem";
import { DragDropContext,Droppable,Draggable } from "react-beautiful-dnd";
import { v4 } from "uuid";
import { updateListsPosition } from "../../store/HandleDb";
import { Media_Query_MD, Media_Query_SM } from "../../components/constant";



const NoteListsDiv=styled.div`
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
const NoteLists=styled.div`//NoteItem
    width:100%;
    border-radius: 8px;
    box-sizing: border-box;
    border: 1px solid #e0e0e0;
    background: "#ffffff";
    height:auto;
    margin: 20px 0;
    padding: 5px;
`
const NoteListCol=styled.div`
    background: #ffffff;
`


const NoteList=({setDataChanged,setList,addData,deleteData,updateData,uid})=>{
            const[isDragged,setIsDragged]=useState(false);
            // const[draggedItem,setDraggedItem]=useState(false);
            const dragItem=useRef();//被拖曳的item
            const dragOverItem=useRef();//拖曳進入的位置
            const draggedItem=useRef();
            
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

    return(
        <NoteListsDiv>
            <NoteListCol className="status" onDrop={dragDrop}>
            { 
            setList.map((item,index)=>{
                if(index %4 ===0){
                    const{id,noteText,noteTitle,image}=item;
                    const board=item.board;
                    const key=v4();
                    return( <NoteLists key={key} ref={draggedItem} onDragLeave={dragLeave} onDragOver={dragOver} id={id} onDragEnter={(e)=>dragEnter(e,index)}  draggable={true}  onDragStart={(e)=>handleDragStart(e,index)} onDragEnd={handleDragEnd}>
                            <NoteItem setDataChanged={setDataChanged}   board={board} key={id} id={id} noteText={noteText} noteTitle={noteTitle} image={image} setList={setList} addData={addData} deleteData={deleteData} updateData={updateData} uid={uid}/> 
                            </NoteLists>
                            )
                }
            })}</NoteListCol>
            <NoteListCol className="status"   onDrop={dragDrop}>
            { 
            setList.map((item,index)=>{
                if(index %4 ===1){
                    const{id,noteText,noteTitle,image}=item;
                    const board=item.board;
                    const key=v4();
                    return( <NoteLists key={key} ref={draggedItem} onDragLeave={dragLeave} onDragOver={dragOver} onDragEnter={(e)=>dragEnter(e,index)}  draggable={true}  onDrag={(e)=>handleDragStart(e,index)} onDragEnd={handleDragEnd}>
                            <NoteItem   setDataChanged={setDataChanged} board={board} key={id} id={id} noteText={noteText} noteTitle={noteTitle} image={image} setList={setList} addData={addData} deleteData={deleteData} updateData={updateData} uid={uid}/> 
                            </NoteLists>
                            )
                }
            })}
            </NoteListCol>
            <NoteListCol className="status"   onDrop={dragDrop}>
            { 
            setList.map((item,index)=>{
                if(index %4 ===2){
                    const{id,noteText,noteTitle,image}=item;
                    const board=item.board;
                    const key=v4();
                    return( <NoteLists key={key} ref={draggedItem} onDragLeave={dragLeave} onDragOver={dragOver}  onDragEnter={(e)=>dragEnter(e,index)}  draggable={true}  onDrag={(e)=>handleDragStart(e,index)} onDragEnd={handleDragEnd}>
                            <NoteItem   setDataChanged={setDataChanged} board={board} key={id} id={id} noteText={noteText} noteTitle={noteTitle} image={image} setList={setList} addData={addData} deleteData={deleteData} updateData={updateData} uid={uid}/> 
                            </NoteLists>
                            )
                }
            })}
            </NoteListCol>
            <NoteListCol className="status"  onDrop={dragDrop}>
            { 
            setList.map((item,index)=>{
                if(index %4 ===3){
                    const{id,noteText,noteTitle,image}=item;
                    const board=item.board;
                    const key=v4();
                    return( <NoteLists key={key} ref={draggedItem} onDragLeave={dragLeave} onDragOver={dragOver} onDragEnter={(e)=>dragEnter(e,index)}  draggable={true}  onDrag={(e)=>handleDragStart(e,index)} onDragEnd={handleDragEnd}>
                            <NoteItem   setDataChanged={setDataChanged} board={board} key={id} id={id} noteText={noteText} noteTitle={noteTitle} image={image} setList={setList} addData={addData} deleteData={deleteData} updateData={updateData} uid={uid}/> 
                            </NoteLists>
                            )
                }
            })}
            </NoteListCol>
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