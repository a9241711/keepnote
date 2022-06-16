import rough from "roughjs/bundled/rough.esm";
import { useEffect,useRef } from "react";
import styled from "styled-components";
import {
  createElement,
  getElementAtPostion,
  adjustElementCoordinates,
  setCursor,
  resizeController,
  adjustElementRequired
  }from "./utils";

const BoardCanvasArea=styled.canvas`
    width: 100%;
    height: 100%;
    position: absolute;
`

const generator = rough.generator();

const BoardCanvas=({elements,setElements,tool,color, range,selectedElement,setSelectedElement,action,setAction,setIsMouseUp,boardData})=>{
    const myRef=useRef();

    
  useEffect(()=>{//若是手機版，畫圖時把scroll event拿掉
    myRef.current.addEventListener('touchstart',function(e){
      if(e.target.id==="canvas"){
        e.preventDefault();
      }
    },{passive:false});
  },[])
  useEffect(() => {//畫圖
      const canvas = document.getElementById("canvas");
      const context = canvas.getContext("2d");
      context.clearRect(0, 0, canvas.width, canvas.height);
      const roughCanvas = rough.canvas(canvas);
      elements.forEach((element) => {
        if(element.type!=="pencil"){
          roughCanvas.draw(element.roughElement)
        }else{
          const linearPathElement = generator.linearPath( element.points, {
            stroke:element.color.strokeColor,
            strokeWidth: element.range,
          });
          roughCanvas.draw(linearPathElement)
        }
      }); 
  },);
    useEffect(()=>{
      if(!boardData) return
      getBoardElements();
    },[boardData])
    const getBoardElements=()=>{
      const array=[];
      boardData.forEach((item)=>{
        if(item.type!=="pencil"){
          const {id,x1,y1,x2,y2,type,color,range}= item; 
          const element = createElement(
          id,
          x1,
          y1,
          x2,
          y2,
          type,
          color,
          range
        );
        array.push({...element});
    
        }else{
          array.push({...item});
        }
      })
      setElements(array);
    }
  
    const updateElement = (id, x1, y1, x2, y2, type, color, range) => {
      const elementsCopy = [...elements]; //把過去所有的值都用其餘函式展開
      switch (type) {
        case "line":
        case "rectangle":
          elementsCopy[id] = createElement(
            id,
            x1,
            y1,
            x2,
            y2,
            type,
            color,
            range
          ); //更新最後的座標值
          break;
        case "pencil":
          elementsCopy[id].points = [
            ...elementsCopy[id].points,
            [x2, y2],
          ];
          break;
        default:
          throw new Error(`type are wrong ${type}`);
      }
      setElements(elementsCopy, true); //更新所有的elements
    }; 
  const handleMouseDown = (event) => {
      const { clientX, clientY } = event; //Event是一個物件，因此透過物件解構賦值把clientX 跟clientY的值指定回去//
      if (tool === "selection") {
        //如果選擇selection工具
        //可以moving移動物件
        const element = getElementAtPostion(clientX, clientY, elements);
  
        if (element) {
          const offsetX = clientX - element.x1; //設立偏移值，解決點擊後物件偏移的問題
          const offsetY = clientY - element.y1;
          //記住正在被選取的是哪個物件
          setSelectedElement({ ...element, offsetX, offsetY });
          setElements((prev) => {
            //保持原本的prev的值 傳到上面的setState會變成[{…},{…}]
            return prev;
          }); //沒有帶入True表示false，會執行setHistory(prev=> [...prev,newState]);
          // setElements(prev)
          if (element.position === "inside") {
            setAction("moving");
          } else {
            setAction("resizing");
          }
        }
      } else {
        const id = elements.length; //以elements的列數做為id
        const element = createElement(
          id,
          clientX,
          clientY,
          clientX,
          clientY,
          tool,
          color,
          range
        );
        setElements((prevState) => [...prevState, element]);
        setAction("drawing");
        setIsMouseUp(false);
      }
    };
    const handleMouseMove = (event) => {
      const { clientX, clientY } = event; //找到移動中的X與Y值，代表是handleMouseMove的終點x2 y2
      if (tool === "selection") {
        const element = getElementAtPostion(clientX, clientY, elements);
        event.target.style.cursor = element
          ? setCursor(element.position)
          : "default";
      }
      if (action === "drawing") {
        const index = elements.length - 1; //找到最後一筆handleMouseDown 的element state
        const { x1, y1 } = elements[index]; //取得x1 y1起點的值
        updateElement(index, x1, y1, clientX, clientY, tool, color,range); //更新x2 y2終點的值
      } else if (action === "moving") {
        const { id, x1, x2, y1, y2, type, offsetX, offsetY, color,range } =
          selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const newX1 = clientX - offsetX;
        const newY1 = clientY - offsetY;
        updateElement(
          id,
          newX1, //解決點擊後產生的偏移值
          newY1,
          newX1 + width,
          newY1 + height,
          type,
          color,
          range
        );
      } else if (action === "resizing") {
        const { id, type, position, color,range, ...element } = selectedElement;
        const { x1, y1, x2, y2 } = resizeController(
          clientX,
          clientY,
          position,
          element
        );
        updateElement(id, x1, y1, x2, y2, type, color,range);
      }
    };
    
    const handleMouseUp = () => {
      
        const index = elements.length - 1;
        const { id, type, color } = elements[index];
        if (
          (action === "drawing" || action === "resizing") &&
          adjustElementRequired(type) //若為true則要更新座標位置
        ) {
          const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
          updateElement(id, x1, y1, x2, y2, type, color, range);
        }
      
      setAction("none");
      setSelectedElement(null);
      setIsMouseUp(true);
    };
    //Set Up for Touch
    const handleTouchStart = (event) => {
      const touch = event.targetTouches[0];
      const clientX=touch.clientX;
      const clientY=touch.clientY;
      // const { clientX, clientY } = event; //Event是一個物件，因此透過物件解構賦值把clientX 跟clientY的值指定回去//
      if (tool === "selection") {
        //如果選擇selection工具
        //可以moving移動物件
        const element = getElementAtPostion(clientX, clientY, elements);
  
        if (element) {
          const offsetX = clientX - element.x1; //設立偏移值，解決點擊後物件偏移的問題
          const offsetY = clientY - element.y1;
          //記住正在被選取的是哪個物件
          setSelectedElement({ ...element, offsetX, offsetY });
          setElements((prev) => {
            //保持原本的prev的值 傳到上面的setState會變成[{…},{…}]
            return prev;
          }); //沒有帶入True表示false，會執行setHistory(prev=> [...prev,newState]);
          // setElements(prev)
          if (element.position === "inside") {
            setAction("moving");
          } else {
            setAction("resizing");
          }
        }
      } else {
        const id = elements.length; //以elements的列數做為id
        const element = createElement(
          id,
          clientX,
          clientY,
          clientX,
          clientY,
          tool,
          color,
          range
        );
        setElements((prevState) => [...prevState, element]);
        setAction("drawing");
        setIsMouseUp(false);
      }
    };
    const handleTouchMove = (event) => {
      // const { clientX, clientY } = event; //找到移動中的X與Y值，代表是handleMouseMove的終點x2 y2
      const touch = event.targetTouches[0];
      const clientX=touch.clientX;
      const clientY=touch.clientY;
      if (tool === "selection") {
        const element = getElementAtPostion(clientX, clientY, elements);
        event.target.style.cursor = element
          ? setCursor(element.position)
          : "default";
      }
      if (action === "drawing") {
        const index = elements.length - 1; //找到最後一筆handleMouseDown 的element state
        const { x1, y1 } = elements[index]; //取得x1 y1起點的值
        updateElement(index, x1, y1, clientX, clientY, tool, color,range); //更新x2 y2終點的值
      } else if (action === "moving") {
        const { id, x1, x2, y1, y2, type, offsetX, offsetY, color,range } =
          selectedElement;
        const width = x2 - x1;
        const height = y2 - y1;
        const newX1 = clientX - offsetX;
        const newY1 = clientY - offsetY;
        updateElement(
          id,
          newX1, //解決點擊後產生的偏移值
          newY1,
          newX1 + width,
          newY1 + height,
          type,
          color,
          range
        );
      } else if (action === "resizing") {
        const { id, type, position, color,range, ...element } = selectedElement;
        const { x1, y1, x2, y2 } = resizeController(
          clientX,
          clientY,
          position,
          element
        );
        updateElement(id, x1, y1, x2, y2, type, color,range);
      }
    };
    const handleTouchEnd = () => {
      const index = elements.length - 1;
      const { id, type, color } = elements[index];
      if (
        (action === "drawing" || action === "resizing") &&
        adjustElementRequired(type) //若為true則要更新座標位置
      ) {
        const { x1, y1, x2, y2 } = adjustElementCoordinates(elements[index]);
        updateElement(id, x1, y1, x2, y2, type, color, range);
      }
    
    setAction("none");
    setSelectedElement(null);
    setIsMouseUp(true);
  };
    return(
        <BoardCanvasArea
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        ref={myRef}
        > 
      </BoardCanvasArea>
    )

}

export default BoardCanvas