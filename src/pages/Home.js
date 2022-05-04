import { useState,useContext } from "react";
import styled from "styled-components";
import HeaderDiv from "../header/Header";
import NotePage from "../note/NoteIndex";
import { GlobalStyle,Text } from "../components/constant";
import { useAuth } from "../store/AuthFirebase";
import Member from "./Member";


const ContentDiv=styled.div`
    position:absolute;
    top: 70px;
    width: 100%;
    display: flex;
    justify-content: center;
`
const IntroDiv=styled.div`
    position:absolute;
    top: 70px;
    width: 100%;
    display: flex;
    justify-content: center;
`
const BannerDiv=styled.div`
    width: 100%;
    background: gray;
    height: 400px;
`

const Home=()=>{
    const isLoggin=JSON.parse(localStorage.getItem("token"));

    return(
        <>
        <GlobalStyle/>
        <HeaderDiv   isLoggin={isLoggin}/>

        {isLoggin?
        <>        
        <ContentDiv>
        <NotePage isLoggin={isLoggin} />
        </ContentDiv> 
        </>
        : 
        <IntroDiv > 
        <BannerDiv>
            <Text>TEST</Text>
        </BannerDiv>
        </IntroDiv>}

        </>
    )
}

export default Home