import styled from "styled-components"
import {  useContext, useRef,  } from "react";
import NoteContext from "../../context/NoteContext";

const NoteBgLists=styled.div`//NoteItem
    width:100%;
    height: 100%;
    background-color: ${props=> props.color};
    position: absolute;
    z-index: 0;
    border-radius: 8px;
    /* border: 1px solid #e0e0e0; */
    box-sizing: border-box;
`

const NoteBgColor=({id,color})=>{
    const colorRef=useRef();
    return(
        <NoteBgLists color={color} id={id} ref={colorRef}></NoteBgLists>
    )

}

export default NoteBgColor