import { useEffect, useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm";
import BoardToDbTool from "./BoardToDbTool";
// import { getStroke } from "perfect-freehand";

const generator = rough.generator();

function createElement(id, x1, y1, x2, y2, type, color, range) {
  console.log("type",type)
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
  const clear = (e) => {
    if (history.length !== 1) {
      setState([]);
    }
    return;
  };
  // console.log(",history[index]", history, setState, undo, redo);
  return [history[index], setState, undo, redo, clear];
};

//取得freehand的getStroke
// const getSvgPathFromStroke = (stroke) => {
//   if (!stroke.length) return "";
//   const d = stroke.reduce(
//     (acc, [x0, y0], i, arr) => {
//       const [x1, y1] = arr[(i + 1) % arr.length];
//       acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
//       return acc;
//     },
//     ["M", ...stroke[0], "Q"]
//   );
//   d.push("Z");
//   return d.join(" ");
// };

// const drawElement = (roughCanvas, element) => {
//   switch (element.type) {
//     case "line":
//     case "rectangle":
//       roughCanvas.draw(element.roughElement);
//       break;
//     case "pencil":
//       const linearPathElement = generator.linearPath(element.points, {
//         stroke: element.color.strokeColor,
//         strokeWidth: element.range,
//       });
//       // const stroke = getSvgPathFromStroke(
//       //   getStroke(element.points, style) //, {size: 65,thinning: 0.7,}option
//       // );
//       // context.fill(new Path2D(stroke));
//       console.log(linearPathElement, element.color);
//       roughCanvas.draw(linearPathElement);
//       break;
//     default:
//       throw new Error(`Type is wrong ${element.type}`);
//   }
// };

function Board() {
  const [elements, setElements, undo, redo, clear] = useHistoryPosition([]); //使用customHook useHistoryPosition
  const [action, setAction] = useState("none");
  // const [elementType, setElementType] = useState("line");
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
  //設定一開始的fetch資料
  const [isData,setIsData]=useState("")

  useEffect(() => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    const roughCanvas = rough.canvas(canvas);
    console.log(elements,"element")
    elements.forEach((element) => {
      if(element.type!=="pencil"){
        roughCanvas.draw(element.roughElement)
      }else{
        const linearPathElement = generator.linearPath( element.points, {
          stroke:element.color.strokeColor,
          strokeWidth: element.range,
        });
        console.log("linearPathElement",linearPathElement);
        roughCanvas.draw(linearPathElement)
      }
    }); 
  },);

  // const drawing=(items)=>{
  //   const canvas = document.getElementById("canvas");
  //   const context = canvas.getContext("2d");
  //   context.clearRect(0, 0, canvas.width, canvas.height);

  //   const roughCanvas = rough.canvas(canvas);
  //   console.log(elements,"element")
  //   items.forEach((element) => {
  //     if(element.type!=="pencil"){
  //       roughCanvas.draw(element.roughElement)
  //     }else{
  //       const linearPathElement = generator.linearPath( element.points, {
  //         stroke:element.color.strokeColor,
  //         strokeWidth: element.range,
  //       });
  //       console.log("linearPathElement",linearPathElement);
  //       roughCanvas.draw(linearPathElement)
  //     }
  //   });
  // }
  const getBoardElements=()=>{
    const array=[];
    isData.forEach((item)=>{
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
    console.log(array)
    setElements(array);
  }


  useEffect(()=>{
    if(!isData) return
    // const array=[]
    // isData.forEach((item)=>{
    //   if(item.type!=="pencil"){
    //     const {id,x1,y1,x2,y2,type,color,range}= item; 
    //     console.log(item)
    //     const element = createElement(
    //     id,
    //     x1,
    //     y1,
    //     x2,
    //     y2,
    //     type,
    //     color,
    //     range
    //   );
    //   array.push({...element});

    //   }else{
    //     console.log(elements,item);
    //     // setElements((prevState) => [...prevState, item]);
    //   }
    // })
    // setElements((prevState) => [...prevState, array]);
    getBoardElements()
    console.log(elements);
    
  },[isData])

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
  }; //更新x2 y2終點的值
  // console.log("elemupdateElementent",updateElement,"firstElements",elements)

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
      console.log("308element",element)
      setElements((prevState) => [...prevState, element]);
      setAction("drawing");
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
  };

  // const save=()=>{
  //   const canvas = document.getElementById("canvas");
  //   let url = canvas.toDataURL();
  //   console.log(url)
  // }

  return (
    <div>
      <div style={{ position: "fixed" }}>
        <input
          type="radio"
          id="selection"
          checked={tool === "selection"}
          onChange={() => {
            setTool("selection");
          }}
        />
        <label htmlFor="selection">selection</label>
        <input
          type="radio"
          id="line"
          checked={tool === "line"}
          onChange={() => {
            setTool("line");
          }}
        />
        <label htmlFor="line">Line</label>
        <input
          type="radio"
          id="rectangle"
          checked={tool === "rectangle"}
          onChange={() => {
            setTool("rectangle");
          }}
        />
        <label htmlFor="rectangle">rectangle</label>
        <input
          type="radio"
          id="pencil"
          checked={tool === "pencil"}
          onChange={() => {
            setTool("pencil");
          }}
        />
        <label htmlFor="pencil">pencil</label>
        <input
          type="color"
          id="strokeColor"
          value={color.strokeColor}
          onChange={(e) => {
            setColor({
              strokeColor: e.target.value,
              fillColor: document.getElementById("fillColor").value,
            });
          }}
        />
        <label htmlFor="strokeColor">strokeColor</label>
        <input
          type="color"
          id="fillColor"
          value={color.fillColor}
          onChange={(e) => {
            setColor({
              strokeColor: document.getElementById("strokeColor").value,
              fillColor: e.target.value,
            });
          }}
        />
        <label htmlFor="color">fillColor</label>
        <input
          type="range"
          value={range}
          min={1}
          max={9}
          step={2}
          onChange={(e) => setRange(e.target.value)}
        />
        <label htmlFor="color">Range</label>
      </div>
      <div style={{ position: "fixed", bottom: 0, padding: 10 }}>
        <button onClick={undo}>Undo</button>
        <button onClick={redo}>Redo</button>
        <button onClick={clear} value={null}>
          Clear
        </button>
          <BoardToDbTool setIsData={setIsData} elements={elements} setElements={setElements}/>
          {/* <button onClick={save} value={null}>
          save
        </button> */}
      </div>
      <canvas
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      >
        canvas
      </canvas>
    </div>
  );
}

export default Board;
