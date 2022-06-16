import rough from "roughjs/bundled/rough.esm";


const generator = rough.generator();


export function createElement(id, x1, y1, x2, y2, type, color, range) {
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
        return { id, type, points: [[x1, y1]], color, range };
      default:
        throw new Error(`Type is wrong ${type}`);
    }
  }
  
const nearPoint = (x, y, postionX, positionY, name) => {
    return Math.abs(x - postionX) < 5 && Math.abs(y - positionY) < 5
      ? name
      : null;
  };
  
  const positionWithinElement = (x, y, element) => {
    //檢查物件是否是該物件
    const { type, x1, x2, y1, y2 } = element;
    if (type === "rectangle") {
      const topLeft = nearPoint(x, y, x1, y1, "tl");
      const topRight = nearPoint(x, y, x2, y1, "tr");
      const bottomLeft = nearPoint(x, y, x1, y2, "bl");
      const bottomRight = nearPoint(x, y, x2, y2, "br");
      const inside = x >= x1 && x <= x2 && y >= y1 && y <= y2 ? "inside" : null;
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
  
export const getElementAtPostion = (x, y, elements) => {
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
  
export const adjustElementCoordinates = (element) => {
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
export const setCursor = (position) => {
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
  
export const resizeController = (clientX, clientY, postion, element) => {
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

export const adjustElementRequired = (type) => ["line", "rectangle"].includes(type); //確認是否為line或是rectangle