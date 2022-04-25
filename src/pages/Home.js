import { useState } from "react";
import styled from "styled-components";
import HeaderDiv from "../header/Header";
import NotePage from "../note/NoteIndex";

const ContentDiv=styled.div`
position:absolute;
top: 70px;
width: 100%;
display: flex;
justify-content: center;
`

const Home=()=>{

    return(
        <>
        <HeaderDiv />
        <ContentDiv>
        <NotePage />
        </ContentDiv>
        </>
    )
}

export default Home