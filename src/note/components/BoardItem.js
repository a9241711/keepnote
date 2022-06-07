import { useEffect, useState } from "react";
import styled from "styled-components"
import rough from "roughjs/bundled/rough.esm";


const BoardList=styled.canvas`
    width:100%;
    background:#f9f6f6;
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
const BoardItem=({board})=>{
    const[boardItems,setBoardItems]=useState("")

    const getBoardElements=(element)=>{
        const array=[];
        element.forEach((item)=>{
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
        setBoardItems(array);
      }
    useEffect(() => {
        if(!boardItems) return
        const canvas = document.getElementById("canvasList");
        const context = canvas.getContext("2d");
        context.clearRect(0, 0, canvas.width, canvas.height);
    
        const roughCanvas = rough.canvas(canvas);
        console.log(boardItems,"element")
        boardItems.forEach((element) => {
          if(element.type!=="pencil"){
            roughCanvas.draw(element.roughElement)
          }else{
            const linearPathElement = generator.linearPath( element.points, {
              stroke:element.color.strokeColor,
              strokeWidth: element.range,
            });
            console.log("linearPathElement",linearPathElement);
            roughCanvas.draw(linearPathElement);
          }
        }); 
    },[boardItems]);

    useEffect(()=>{
        //顯示已有的圖片畫面
        if(!board) return
        getBoardElements(board);
    },[])

    return(
        <BoardList 
        id="canvasList"         
        width={window.innerWidth}
        height={window.innerHeight}>
            
        </BoardList>
    )

}

// export default BoardItem