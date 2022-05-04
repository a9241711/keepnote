import { useState, useEffect, useLayoutEffect } from "react";
import { act } from "react-dom/test-utils";
import rough from "roughjs/bundled/rough.esm";

// const generator = rough.generator(); //定義rough generator

// function createElement(id, x1, y1, x2, y2, type) {
//   // const type = type;
//   if (type === "line") {
//     const roughElement = generator.line(x1, y1, x2, y2, type);
//     return { id, x1, y1, x2, y2, roughElement, type };
//   } else if (type === "rectangle") {
//     const roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1, type);
//     return { id, x1, y1, x2, y2, roughElement, type };
//   } else if (type === "linearPath ") {
//     console.log("allPositionElement", allPositionValue);
//     const roughElement = generator.linearPath([x1, y1], allPositionValue, type);
//     return { id, x1, y1, roughElement, type };
//   }
//   // const roughElement =
//   //   type === "line"
//   //     ? generator.line(x1, y1, x2, y2, type)
//   //     : generator.rectangle(x1, y1, x2 - x1, y2 - y1, type);
//   // return { id, x1, y1, x2, y2, roughElement, type };
// }

function BoardTry() {
  const [elements, setElements] = useState([]); //儲存X Y 與物件屬性
  const [tool, setTool] = useState("line");
  const [action, setAction] = useState("none");
  const [selectElement, setSelectElement] = useState(null);
  const [allPositionValue, setAllPositionValue] = useState([]);

  const generator = rough.generator(); //定義rough generator

  function createElement(id, x1, y1, x2, y2, type) {
    // const type = type;
    if (type === "line") {
      console.log("line");
      const roughElement = generator.line(x1, y1, x2, y2, type);
      return { id, x1, y1, x2, y2, roughElement, type };
    } else if (type === "rectangle") {
      const roughElement = generator.rectangle(x1, y1, x2 - x1, y2 - y1, type);
      return { id, x1, y1, x2, y2, roughElement, type };
    } else if (type === "linearPath") {
      console.log("allPositionElement", [[x1, y1], ...allPositionValue]);
      const roughElement = generator.linearPath(
        [[x1, y1], ...allPositionValue],
        type
      );
      console.log("roughElement", roughElement, "id", id, "x1", x1, "y1", y1);
      return { id, x1, y1, x2, y2, roughElement, type };
    }
  }
  useLayoutEffect(() => {
    const canvas = document.getElementById("canvas");
    const ctx = canvas.getContext("2d"); //有可能會出現null，是因為還沒載完成頁面就執行了，要加入window.onload之類的

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const roughCanvas = rough.canvas(canvas);

    // let rect2 = generator.rectangle(10, 120, 100, 100, { fill: "red" });
    elements.forEach((item) => {
      //   console.log(item);
      roughCanvas.draw(item.roughElement);
    });
    roughCanvas.linearPath([
      [690, 10],
      [790, 20],
      [750, 120],
      [690, 100],
    ]);
  });

  const nearPoint = (x, y, x1, y1, name) => {
    return Math.abs(x - x1) < 5 && Math.abs(y - y1) < 5 ? name : null;
  };

  const positionInElement = (x, y, element) => {
    //傳入的xy表示MouseDwon的位置
    const { x1, y1, x2, y2, type } = element;
    if (type === "rectangle") {
      //要找到四個或是在裡面
      const topLeft = nearPoint(x, y, x1, y1, "tl"); //左上角
      const topRight = nearPoint(x, y, x2, y1, "tr"); //右上角
      const bottomRight = nearPoint(x, y, x2, y2, "br"); //右下角
      const bottomLeft = nearPoint(x, y, x1, y2, "bl"); //左下角
      const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null; //xy在框框內
      return topLeft || topRight || bottomRight || bottomLeft || inside;
    } else if (type === "line") {
      const a = { x: x1, y: y1 };
      const b = { x: x2, y: y2 };
      const c = { x: x, y: y };
      const offset = distance(a, b) - (distance(a, c) + distance(b, c));
      const start = nearPoint(x, y, x1, y1, "start");
      const end = nearPoint(x, y, x2, y2, "end");
      const inside = Math.abs(offset) < 1 ? "inside" : null;
      return start || end || inside;
    }
  };
  function distance(a, b) {
    return Math.sqrt(Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2));
  }

  const getElementAtPosition = (x, y, elements) => {
    return elements
      .map((element) => {
        return { ...element, position: positionInElement(x, y, element) }; //取得position return
      })
      .find((element) => element.position !== null); //返回非null的value
  };

  const handleMouseDown = (event) => {
    const { clientX, clientY } = event;
    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      // console.log(element);
      if (element) {
        const offsetX = clientX - element.x1; //取得C點到x1的距離
        const offsetY = clientY - element.y1; //取得C點到y1的距離
        // console.log("element", element, "offsetX", offsetX, "offsetY", offsetY);
        setSelectElement({ ...element, offsetX, offsetY }); //設定選取物件的value
        if (element.position === "inside") {
          setAction("moving");
        } else {
          setAction("resizing");
        }
      }
    } else {
      //   console.log(clientX, clientY);
      const id = elements.length;
      const element = createElement(
        id,
        clientX,
        clientY,
        clientX,
        clientY,
        tool
      );
      console.log("element", element);
      setElements((prev) => [...prev, element]);
      //   console.log("elements", elements);
      setAction("drawing");
    }
  };

  const updateElement = (index, x1, y1, x2, y2, type) => {
    const updatedElement = createElement(index, x1, y1, x2, y2, type);
    // console.log(",updatedElement", updatedElement);
    const newElements = [...elements]; //要讓newElement取得當前的array
    newElements[index] = updatedElement; //再把最後一個array更新成新的xy 座標位置
    setElements(newElements);
  };

  const setPointer = (position) => {
    //物件滑鼠效果
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

  const resizeController = (clientX, clientY, position, element) => {
    const { x1, y1, x2, y2 } = element; //取得element原本的xy位置
    switch (position) {
      case "tl":
      case "start":
        return { x1: clientX, y1: clientY, x2: x2, y2: y2 };
      case "tr":
        return { x1: x1, y1: clientY, x2: clientX, y2: y2 };
      case "bl":
        return { x1: clientX, y1: y1, x2: x2, y2: clientY };
      case "br":
      case "end":
        return { x1: x1, y1: y1, x2: clientX, y2: clientY };
      default:
        return null;
    }
  };

  const handleMouseMove = (event) => {
    const { clientX, clientY } = event; //取得move的clintX & clientY;
    if (tool === "selection") {
      const element = getElementAtPosition(clientX, clientY, elements);
      event.target.style.cursor = element
        ? setPointer(element.position)
        : "default";
    }
    if (action === "drawing") {
      if (tool === "linearPath") {
        const arr = [clientX, clientY];
        setAllPositionValue((prev) => [...prev, arr]);
        console.log("allPositionValue", allPositionValue);
        const index = elements.length - 1; //取得最後一個elements的arr去更新
        const { x1, y1, type } = elements[index]; //取得最後一個elements的arr的x1跟y1當作起點
        updateElement(index, x1, y1, clientX, clientY, type); //傳入起點x1y1終點clientX clientY更新最後的位置
        console.log("linearPath", allPositionValue, { x1, y1, type });
      } else {
        const index = elements.length - 1; //取得最後一個elements的arr去更新
        const { x1, y1, type } = elements[index]; //取得最後一個elements的arr的x1跟y1當作起點
        updateElement(index, x1, y1, clientX, clientY, type); //傳入起點x1y1終點clientX clientY更新最後的位置
      }
    } else if (action === "moving") {
      const { id, x1, y1, x2, y2, type, offsetX, offsetY } = selectElement;
      const width = x2 - x1;
      const height = y2 - y1;
      const startX = clientX - offsetX;
      const startY = clientY - offsetY;
      updateElement(id, startX, startY, startX + width, startY + height, type);
    } else if (action === "resizing") {
      const { id, type, position, ...element } = selectElement;
      const { x1, y1, x2, y2 } = resizeController(
        clientX,
        clientY,
        position,
        element
      );
      console.log("resizeControler", { x1, y1, x2, y2 });
      updateElement(id, x1, y1, x2, y2, type);
    }
  };

  const adjustPosition = (element) => {
    const { x1, y1, x2, y2, type } = element;
    if (type === "rectangle") {
      const minX = Math.min(x1, x2);
      const maxX = Math.max(x1, x2);
      const minY = Math.min(y1, y2);
      const maxY = Math.max(y1, y2);
      return { x1: minX, x2: maxX, y1: minY, y2: maxY };
    } else {
      if (x1 < x2 || (x1 === x2 && y1 < y2)) {
        //由左至右畫，或是垂直
        return { x1, x2, y1, y2 };
      } else {
        //由右至左畫
        return { x1: x2, y1: y2, x2: x1, y2: y1 };
      }
    }
  };

  const handleMouseUp = () => {
    const index = elements.length - 1;
    const { id, type } = elements[index];
    console.log("handleMouseUp", index, { id, type });
    if (action === "drawing" || action === "resizing") {
      //要解決從右下畫到左上的座標位置問題，否則位置會錯誤
      const { x1, y1, x2, y2 } = adjustPosition(elements[index]);
      updateElement(id, x1, y1, x2, y2, type);
    }

    setAction("none");
    // getElementAtPosition(null);
  };

  return (
    <div>
      <div style={{ position: "fixed" }}>
        <input
          type="radio"
          checked={tool === "selection"}
          onChange={() => {
            setTool("selection");
          }}
        />
        <label htmlFor="Selection">Selection</label>
        <input
          type="radio"
          checked={tool === "line"}
          onChange={() => {
            setTool("line");
          }}
        />
        <label htmlFor="line">line</label>
        <input
          type="radio"
          checked={tool === "rectangle"}
          onChange={() => {
            setTool("rectangle");
          }}
        />
        <label htmlFor="line">rectangle</label>
        <input
          type="radio"
          checked={tool === "linearPath"}
          onChange={() => {
            setTool("linearPath");
          }}
        />
        <label htmlFor="linearPath">linearPath</label>
      </div>
      <canvas
        id="canvas"
        width={window.innerWidth}
        height={window.innerHeight}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
      ></canvas>
    </div>
  );
}

export default BoardTry;
