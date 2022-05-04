import rough from "roughjs/bundled/rough.esm";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { saveBoardData } from "../../store/HandleDb";


const BoardCanvasDiv=styled.canvas`
    width:100%;
    height:100vh;
    position:absolute;
`

const generator = rough.generator();

function createElement(id, x1, y1, x2, y2, type, color, range) {
  switch (type) {
    case "line":
    case "rectangle":
      const roughElement =
        type === "line" //判斷type是line或retangle
          ? generator.line(x1, y1, x2, y2, {
              stroke: color.strokeColor,
              strokeWidth: range,
            }) //option {strokeWidth: 5}
          : generator.rectangle(x1, y1, x2 - x1, y2 - y1, {
              stroke: color.strokeColor,
              // fill: color.fillColor,
              strokeWidth: range,
            });
      return { id, x1, y1, x2, y2, type, roughElement, color,range };
    case "pencil":

      // return { id, type, points: [{ x: x1, y: y1 }], color };
      return { id, type, points: [[x1, y1]], color, range };
    default:
      throw new Error(`Type is wrong ${type}`);
  }
  //type ===line or rectangle
}

const nearPoint = (x, y, postionX, positionY, name) => {
  return Math.abs(x - postionX) < 5 && Math.abs(y - positionY) < 5
    ? name
    : null;
};

const positionWithinElement = (x, y, element) => {
  // console.log("positionWithinElement", x, y, element);
  //檢查物件是否是該物件
  const { type, x1, x2, y1, y2 } = element;
  if (type === "rectangle") {
    const topLeft = nearPoint(x, y, x1, y1, "tl");
    const topRight = nearPoint(x, y, x2, y1, "tr");
    const bottomLeft = nearPoint(x, y, x1, y2, "bl");
    const bottomRight = nearPoint(x, y, x2, y2, "br");
    const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
    // console.log(topLeft || topRight || bottomLeft || bottomRight || inside);
    return topLeft || topRight || bottomLeft || bottomRight || inside;
  } else {
    const a = { x: x1, y: y1 };
    const b = { x: x2, y: y2 };
    const c = { x, y };
    const offset = distance(a, b) - (distance(a, c) + distance(b, c));
    const start = nearPoint(x, y, x1, y1, "start");
    const end = nearPoint(x, y, x2, y2, "end");
    const inside = Math.abs(offset) < 1 ? "inside" : null;
    return start || end || inside; //abs絕對值 //若計算結果小於1回傳true，表示選到該line`,反之則False
  }
};
const distance = (a, b) => {
  return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2)); ///sqrt回傳參數的平方根，例如Math.sqrt(9)//3
}; //pow 要乘上base幾次的指數，例如pow(7,2) //49，若無法得出一個數則NaN

const getElementAtPostion = (x, y, elements) => {
  //找到第一個符合element並且傳入isWithElement
  return elements
    .map((element) => ({
      ...element,
      position: positionWithinElement(x, y, element),
    }))
    .find((element) => {
      return element.position !== null;
    });
};

const adjustElementCoordinates = (element) => {
  const { type, x1, y1, x2, y2 } = element;
  if (type === "rectangle") {
    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);
    return { x1: minX, y1: minY, x2: maxX, y2: maxY };
  } else {
    if (x1 < x2 || (x1 === x2 && y1 < y2)) {
      return { x1, y1, x2, y2 };
    } else {
      return { x1: x2, y1: y2, x2: x1, y2: y1 };
    }
  }
};



const BoardCanvas=({elements,setElements,tool,color, range,selectedElement,setSelectedElement,action,setAction,setIsMouseUp,boardData})=>{

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
            // console.log("linearPathElement",linearPathElement);
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
    
      const setCursor = (position) => {
        switch (position) {
          case "tl":
          case "br":
          case "start":
          case "end":
            return "nwse-resize";
          case "tr":
          case "bl":
            return "nesw-resize";
          default:
            return "move";
        }
      };
    
      const resizeController = (clientX, clientY, postion, element) => {
        const { x1, y1, x2, y2 } = element;
        switch (postion) {
          case "tl":
          case "start":
            return { x1: clientX, y1: clientY, x2: x2, y2: y2 };
          case "tr":
            return { x1: x1, y1: clientY, x2: clientX, y2: y2 };
          case "br":
          case "end":
            return { x1: x1, y1: y1, x2: clientX, y2: clientY };
          case "bl":
            return { x1: clientX, y1: y1, x2: x2, y2: clientY };
          default:
            return null;
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
    
      const adjustElementRequired = (type) => ["line", "rectangle"].includes(type); //確認是否為line或是rectangle
    
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
    

    return(

        <BoardCanvasDiv
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        > 
      </BoardCanvasDiv>
    )

}

export default BoardCanvas