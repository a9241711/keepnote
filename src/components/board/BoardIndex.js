import React,{ useState, useEffect }  from "react";
import BoardDrawingTool from "./BoardDrawingTool";
import BoardStep from "./BoardStep";
import styled from "styled-components";
import BoardOutfit from "./BoardOutfit";
import BoardCanvas from "./BoardCanvas";
import { saveBoardData,getBoardData,updateBoardData } from "../../store/HandleDb";
import {useLocation, useNavigate} from "react-router-dom";



const ToolNav=styled.div`
  position:fixed;
  display:flex;
  width:100%;
  border-bottom:1px solid rgba(0,0,0,.24);
  touch-action:none;
  user-select:none;
  z-index:999;
  background-color: #FFF;
`
const BoardDrawToollDiv=styled.div`
  display: flex;
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
  return [history[index],index, setState, undo, redo, clear];
};

const BoardIndex =()=>{
    const location=useLocation();//從noteTool傳id,uid board data過來
    const{id,board,uid}=location["state"]//取得id,uid board 

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
    //設定取得已存在的board的資料
    const[boardData,setBoardData]=useState("");
    //navigate
    const navigate = useNavigate();


    useEffect(()=>{//檢查是否已有Board資料，取得指定board資料
      async function getBoardDataFromDb(){   
        const getBoardElements = await getBoardData(id,uid);
        setBoardData(getBoardElements);
      }
      getBoardDataFromDb();
    },[])


    useEffect(()=>{//檢查mouseUp Event，並傳入DB
      async function getBoardElements (elements,id,uid){
        const index=elements.length-1;
        await saveBoardData(elements[index],id,uid);
      }
      if(elements.length ===0) return
      else{
        if(isMouseUp){
          getBoardElements (elements,id,uid)
        }else return;
      }
    },[action])

    useEffect(() => {
      const saveBoardToDb= async()=>{
        const canvas = document.getElementById("canvas");
        const url=canvas.toDataURL();
        await updateBoardData(id,url,uid);//存入base64
      }
      const handler =async (e) => {
        e.preventDefault();
        e.returnValue=true;//彈出訊息提醒，並重新導向，防止重新整理頁面導致資料遺失
        await saveBoardToDb();
        setTimeout(() => {
          navigate("/boarding",{ replace: true },{state:{id,board,uid}})
        }, 500);
      };
  
      window.addEventListener("beforeunload", handler);
      return () => window.removeEventListener("beforeunload", handler);
    }, [elements]);

    return(
        <>
            <ToolNav>
            <BoardDrawToollDiv>
            <BoardDrawingTool id={id} tool={tool} setTool={setTool} elements={elements} uid={uid}/>
            <BoardOutfit color={color} setColor={setColor} range={range} setRange={setRange}/>
            </BoardDrawToollDiv>
            <BoardStep undo={undo} redo={redo} clear={clear} id={id} currentIndex={currentIndex} uid={uid}/>
            </ToolNav>
            <BoardCanvas elements={elements} setElements={setElements} tool={tool} color={color} range={range} selectedElement={selectedElement} setSelectedElement={setSelectedElement}action={action} setAction={setAction} setIsMouseUp={setIsMouseUp} boardData={boardData}/>
        </>
    )
}

export default BoardIndex