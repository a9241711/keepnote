import React,{ useState,createContext, useEffect }  from "react";
import BoardToDbTool from "./BoardToDbTool";
import BoardDrawingTool from "./BoardDrawingTool";
import BoardStep from "./BoardStep";
import styled from "styled-components";
import BoardOutfit from "./BoardOutfit";
import BoardCanvas from "./BoardCanvas";
import { saveBoardData,getBoardData,saveNoteData } from "../store/HandleDb";
import {useLocation} from "react-router-dom";
import { v4 } from "uuid";
// import { BoardContext } from "./BoardContext";

export const BoardContext=createContext({name:"guest"})

const BoardDiv = styled.div`
  width: 100%;
  background:#FFFFFF;
  height: 100vh;
`;
const ToolNav=styled.div`
  position:fixed;
  display:flex;
  width:100%;
  border-bottom:1px solid rgba(0,0,0,.24);
  padding:8px 0;
  touch-action:none;
  user-select:none;
  z-index:999;
`
const useHistoryPosition = (initialState) => {
  //customHook用use+自定義名稱，就可以製作自己的hook
  const [index, setIndex] = useState(0); //記錄所有圖形的位置
  const [history, setHistory] = useState([initialState]); //要記錄所有圖形的狀態[[],[{}],[{}]]
  const setState = (setElementValue, overwrite = false) => {
    //這裡的setState(setElementValue) ===下面的setElements
    const newState =
      typeof setElementValue === "function"
        ? setElementValue(history[index])
        : setElementValue; //setElements((prevState) => [...prevState, element]);or setElements(elementsCopy);
    if (overwrite) {
      //如果是true，表示是從updateElement傳入的
      const historyCopy = [...history];
      historyCopy[index] = newState;
      setHistory(historyCopy);
    } else {
      // if(index===0 && newState.length>1){//原來就存在db的資料
      //   setHistory([...newState.map((item)=> item)]);
      //   setIndex(newState.length)
      //   console.log(history.length)
      const updateState = [...history].slice(0, index + 1); //取0~最新狀態
      setHistory([...updateState, newState]); //
      setIndex((prev) => prev + 1);
      }     
  }; 
  const undo = () => {
    return index > 0 && setIndex((prev) => prev - 1);
  };
  const redo = () => {
    return index < history.length - 1 && setIndex((prev) => prev + 1);
  };
  //clear all
  const clear = () => {
    if (history.length !== 1) {
      setState([]);
    }
    return;
  };
  // console.log(",history[index]", history, setState, undo, redo);
  return [history[index],index, setState, undo, redo, clear];
};

const BoardIndex =()=>{
    const location=useLocation();
    const{noteText,noteTitle,id}=location["state"]//取得noteTitle 跟noteText
    console.log({noteText,noteTitle,id})
    const [elements,currentIndex, setElements, undo, redo, clear]=useHistoryPosition([]); //使用customHook
    //設定action動作
    const [action, setAction] = useState("none");
    //取得tool工具
    const [tool, setTool] = useState("pencil");
    //設定被選取物件
    const [selectedElement, setSelectedElement] = useState(null);
    //設定顏色
    const [color, setColor] = useState({
      fillColor: "#000000",
      strokeColor: "#000000",
    });
    //設定大小
    const [range, setRange] = useState(1);
    //設定檢查是否MouseUp
    const[isMouseUp,setIsMouseUp]=useState(false);
    //設定取得指定board的資料
    const[boardData,setBoardData]=useState("");
    // const getLastElement=()=>{
    //   // const index =elements.length-1;//最後一個位置
    //   const elementsCopoy=[...elements,]
    //   return elementsCopoy
    // }


    // useEffect(()=>{//檢查是否已有Board資料，取得指定board資料
    //   async function getBoardDataFromDb(){   
    //     const getBoardElements = await getBoardData();
    //     console.log(getBoardElements);
    //     setBoardData(getBoardElements);
    //     console.log(getBoardElements);
    //   }
    //   getBoardDataFromDb();
    // },[])

    useEffect(()=>{//檢查mouseUp Event，並傳入DB
      async function getBoardElements (elements,noteTitle,noteText){
        const index=elements.length-1;
        console.log(elements,noteTitle,noteText)
        await saveBoardData(elements[index],id,noteTitle,noteText);
      }
      if(elements.length ===0) return
      else{
        if(isMouseUp){
          console.log(elements,isMouseUp);
          getBoardElements (elements,noteTitle,noteText)
        }else return;
      }
    },[action])

    return(
        <BoardContext.Provider value={[elements,setElements]} >
            <BoardDiv>
            <ToolNav>
            <BoardDrawingTool  tool={tool} setTool={setTool} />
            <BoardOutfit color={color} setColor={setColor} range={range} setRange={setRange}/>
            <BoardStep undo={undo} redo={redo} clear={clear} elements={elements} currentIndex={currentIndex}/>
            </ToolNav>
            <BoardCanvas elements={elements} setElements={setElements} tool={tool} color={color} range={range} selectedElement={selectedElement} setSelectedElement={setSelectedElement}action={action} setAction={setAction} setIsMouseUp={setIsMouseUp} boardData={boardData}/>
            <BoardToDbTool  elements={elements}/>
            </BoardDiv>
        </BoardContext.Provider>

    )
}

export default BoardIndex