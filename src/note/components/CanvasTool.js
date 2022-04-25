import styled from "styled-components";
import canvasIcon from "./img/paintbrush.png";
import { Link } from "react-router-dom";
import { v4 } from "uuid";

const CanvasTools=styled.div`
width:36px;
&:hover{
    cursor:pointer;
}
`
const CanvasToolIcon=styled.img`
width: 100%;
`

const CanvasTool=({noteTitle ,noteText} )=>{
    const id=v4();

    return(
        <CanvasTools >
            <Link  to={"/boarding"} state={{id,noteTitle,noteText}}>
            <CanvasToolIcon src={`${canvasIcon}`}> 
            </CanvasToolIcon>
            </Link>
        </CanvasTools>
    )
}


export default CanvasTool