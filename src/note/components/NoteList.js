import { useState } from "react";
import styled from "styled-components";
import NoteItem from "./NoteItem";
import { DragDropContext,Droppable,Draggable } from "react-beautiful-dnd";
import { db } from "../../store/firebase";
import { collection,updateDoc,doc } from "firebase/firestore";



const NoteListsDiv=styled.div`
display: grid;
grid-template-columns: repeat(4,1fr);

`
const DragDiv=styled.div`
    width:280px;
    display:flex;
    flex-direction: column;
    align-items: flex-start;
    margin:30px 10px 18px 0;
    border-radius: 8px;
    box-sizing: border-box;
     border: 1px solid #e0e0e0;
     background:#ffffff;
     box-sizing:border-box;
`

const NoteList=({setList,addData,deleteData,updateData})=>{
        // const{noteText,noteTitle}=setList

   async function handleDragEnd(result){
        if(!result.destination) return;
        const sourceIndex=result.source.index;
        const destinationIndex=result.destination.index;
        const [reorderItem]= setList.splice(sourceIndex,1);//取出要換位置的item
        setList.splice(destinationIndex,0,reorderItem);//更新更動位置後的物件
        const setListCopy= setList.map((item,index)=> ({...item,index:index}));
            //讀取文件Id
        // const updateToDb=doc(db,"NoteList",id);//這裡id要改成會員id
        // await updateDoc(updateToDb,setListCopy);
        updateData(setListCopy);
    }

    const getItemStyle=(isDragging,draggableStyle)=>({
        userSelect:"none",
        boxShadow:isDragging?'0 0 .2rem #666':"none",
        //預設需要加入
        ...draggableStyle
    })

    return(
        <NoteListsDiv>
            {
            setList.map((item)=>{
                const{id,noteText,noteTitle}=item;
                return( 
                        <NoteItem   key={id} id={id} noteText={noteText} noteTitle={noteTitle} setList={setList} addData={addData} deleteData={deleteData} updateData={updateData}/> 
                        )
            })
            }
        </NoteListsDiv>
    )
}
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