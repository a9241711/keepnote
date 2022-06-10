import styled from "styled-components"
import { useRef  } from "react";

const NoteBgLists=styled.div`//NoteItem
    width:100%;
    height: 100%;
    background-color: ${props=> props.color};
    position: absolute;
    z-index: 0;
    border-radius: 8px;
    box-sizing: border-box;
`

const NoteBgColor=({id,color})=>{//main color bg
    const colorRef=useRef();
    return(
        <NoteBgLists color={color} id={id} ref={colorRef}></NoteBgLists>
    )

}

export default NoteBgColor


export const ArchiveBgColor=({id,color})=>{//for Arichve page

    return(
        <NoteBgLists color={color} id={id} ></NoteBgLists>
    )

}

