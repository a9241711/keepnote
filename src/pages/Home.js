import { useState,useContext } from "react";
import styled from "styled-components";
import HeaderDiv from "../header/Header";
import NotePage from "../note/NoteIndex";
import { GlobalStyle,H3,Text } from "../components/constant";
import { H1 } from "../components/constant";
import { Link } from "react-router-dom";
import SearchReducer from "../header/components/SearchReducer";
import NavSideBar from "../header/components/NavSideBar";


const ContentDiv=styled.div`
    position:absolute;
    top: 70px;
    width: 100%;
    display: flex;
    justify-content: center;
`
const IntroDiv=styled.div`
    width: 100%;
    max-width: 1200px;
    position: absolute;
    top: 70px;
    left: 0;
    right: 0;
    margin: 0 auto;
`
const BannerDiv=styled.div`
    width: 100%;
    height: 400px;
    display: flex;
    justify-content: center;
    align-items: center;
`
const MainDiv=styled.div`
    text-align: center;
    max-width: 80%;
    margin: 0 auto;
`
const Title=styled(H1)`
    font-size: 54px;
    margin: 30px;
`
const SignUpBtn=styled.button`
    background: #FBBC04;
    border: 0;
    border-radius: 8px;
    font-weight: 700;
    color: #fff;
    display: inline-block;
    font-size: 14px;
    letter-spacing: 1.5px;
    line-height: 1;
    padding: 18px 32px 17px;
    text-align: center;
    text-decoration: none;
    margin: 20px 0;
    transition: all ease-in .2s;
    &:hover{
        background: #FFC414;
        cursor: pointer;
    }
`
const SingInLink=styled(Link)`
    color: black;
    text-decoration: underline;
    font-size: 18px;
    display: block;
    transition: all ease-in .2s;
    &:hover{
        color: #E9AF00;
    }
`
const Home=()=>{
    const isLoggin=JSON.parse(localStorage.getItem("token"));

    return(
        <>
        <GlobalStyle/>

        <SearchReducer>
        <HeaderDiv   isLoggin={isLoggin}/>

        {isLoggin?
        <>        
        <ContentDiv>
        <NavSideBar />
        <NotePage isLoggin={isLoggin} />
        </ContentDiv> 
        </>
  

        : 
        <IntroDiv > 
        <BannerDiv>
            <MainDiv>
            <Title>紀錄您的日常瑣事...</Title>
            <H3>輕鬆記住所有事情、忙碌的生活也不遺漏任何事。</H3>
            <Link  to={"/signup"} style={{textDecoration: "none"}}>
            <SignUpBtn>免費註冊</SignUpBtn>
            </Link>
            {/* <Link  to={"/login"} style={{textDecoration: "none"}}> */}
            <SingInLink  to={"/login"}>已經有帳戶嗎？登入</SingInLink>
            {/* </Link> */}
            </MainDiv>
        </BannerDiv>
        </IntroDiv>}
        </SearchReducer>
        </>
    )
}

export default Home