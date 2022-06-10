import { Link } from "react-router-dom";
import styled from "styled-components";
import { GlobalStyle,H3,H1 } from "../components/constant";
import HeaderDiv from "../header/Header";
import NotePage from "../note/NoteIndex";
import NavSideBar from "../header/components/NavSideBar";
import SearchReducer from "../header/components/SearchReducer";


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
    position: relative;
    margin: 0 auto;
`
const BannerDiv=styled.div`
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`
const MainDiv=styled.div`
    text-align: center;
    max-width: 100%;
    margin: 0 auto;
    position:absolute;
    top: 25%;
`
const Title=styled(H1)`
    font-size: 54px;
    margin: 30px;
`
const SubTitle=styled(H3)`
    margin: 0 30px;
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
                    <Title>KeepNote</Title>
                    <Title>直覺化的圖文記事工具</Title>
                    <SubTitle>紀錄您所有日常瑣事、忙碌的生活也不遺漏任何事</SubTitle>
                    <Link  to={"/signup"} style={{textDecoration: "none"}}>
                    <SignUpBtn>免費註冊</SignUpBtn>
                    </Link>
                    <SingInLink  to={"/login"}>已經有帳戶嗎？登入</SingInLink>
                </MainDiv>
            </BannerDiv>
        </IntroDiv>}
        </SearchReducer>
        </>
    )
}

export default Home