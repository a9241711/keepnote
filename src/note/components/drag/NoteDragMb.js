import { DragDropContext,Droppable,Draggable } from 'react-beautiful-dnd';
import styled from "styled-components"
import NoteItem from '../NoteItem';
import { Media_Query_SM,Media_Query_SMD} from '../../../components/constant';
import NoteBgColor from '../color/NoteBgColor';

const NoteListsMbDiv=styled.div`
    display: none; 
    width: 100%;
    justify-items: center;
    grid-column-gap: 5px;
    ${Media_Query_SM} {
        max-width: 480px;
        display: grid;
        grid-template-columns: repeat(2,1fr);
    }
    ${Media_Query_SMD}{
        max-width: 768px;
        display: grid;
        grid-template-columns: repeat(2,1fr);
    }
`
const DragDiv=styled.div`
    width: 100%;
    min-height: 100px;
    box-sizing: border-box;
    height:auto;
    margin: 5px;
    transition: all ease-in 0.2s;
    position: relative;
    border-radius: 8px;
    ${Media_Query_SM} {
        max-width: 165px;
    }
    ${Media_Query_SMD}{
        max-width: 350px;
    }
`

const NoteDragMb=({setIsDragged,setDataChanged,setList,uid,updateData,setSelected})=>{
      async function handleDragEnd(result){
      if(!result.destination) return;
      const sourceIndex=result.source.index;//被拿取的位置
      const destinationIndex=result.destination.index;//最後被放置的位置
      console.log(result);
      const setListCopy=[...setList];//取得所有lists;
      const dragedItem=setListCopy[sourceIndex];//取得被拖曳item的值;
      setListCopy.splice(sourceIndex,1);//刪掉被拖曳item的值
      setListCopy.splice(destinationIndex,0,dragedItem);//在插入的位置加上被拖曳的item
      updateData(setListCopy);//更新setList狀態
      setIsDragged(true);//已經拖曳移動過
    }

const getItemStyle=(isDragging,draggableStyle)=>({
    userSelect:"none",
    border:isDragging?'2px dashed black':"1px solid #565656",
    //預設需要加入
    ...draggableStyle
})

    return(
         <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="noteLists" type="Lists">
                {(provided,snapshot)=>(
                <NoteListsMbDiv  {...provided.droppableProps} ref={provided.innerRef} style={{...provided.droppableProps.style}}>
            {
            setList.map((item,index)=>{
                    const{id,noteText,noteTitle,image,time,color,whenToNotify=""}=item;
                    const board=item.board;
                    return(  <Draggable key={id} draggableId={id} index={index} >
                            {(provided,snapshot)=>(
                            <DragDiv  ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={getItemStyle(snapshot.isDragging,provided.draggableProps.style)} >
                            <NoteBgColor id={id}  color={color}/>
                            <NoteItem  whenToNotify={whenToNotify}  setSelected={setSelected}  setDataChanged={setDataChanged}   board={board} key={id} id={id} noteText={noteText} noteTitle={noteTitle} image={image} setList={setList}  uid={uid}/> 
                            </DragDiv>
                            )}
                            </Draggable>
                            )
                })
             }   
                {provided.placeholder}
                </NoteListsMbDiv>
            )}
            </Droppable>
        </DragDropContext>
        
    )
}

export default NoteDragMb