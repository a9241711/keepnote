import styled from "styled-components";
import { Link } from "react-router-dom";
import { v4 } from "uuid";
import { EditBoard } from "../../assets";

const CanvasTools=styled.div`
    width:32px;
    height: 32px;
    display: flex;
    justify-content: center;
    align-items: center;

    &:hover{
        background-color: rgba(95,99,104,0.157);
        border-radius: 50%;
        cursor:pointer;
}
`
const CanvasToolIcon=styled.div`
    width: 24px;
    height: 24px;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url(${EditBoard}) ;
`

const CanvasTool=({noteTitle ,noteText,uid} )=>{//上方輸入框的icon，把文字跟board畫板帶入到下一個頁面並儲存
    const id =v4()

    return(
        <CanvasTools >
            <Link  to={"/boarding"} state={{id,noteTitle,noteText,uid}}>
            <CanvasToolIcon > 
            </CanvasToolIcon>
            </Link>
        </CanvasTools>
    )
}


export default CanvasTool