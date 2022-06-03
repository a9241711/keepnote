import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { H1, H2, H3, IconDiv, IconTipText, Text } from "../components/constant";
import Search from "./Search";
import LogOut from "./LogOut";
import LogIn from "./LogIn";
import User from "./User";
import { Link } from "react-router-dom";
import { KeepLogo, Loading, ReFresh,Nav } from "../assets";
import HeaderLoadContext from "./HeaderLoadContext";


const Header = styled.div`
  width: 100%;
  height: 65px;
  position: fixed;
  top:0;
  display: flex;
  border-bottom: 1px solid rgb(218, 220, 224);
  align-items: center;
  justify-content: space-around;
  padding: 0 25px;
  z-index: 500;
  background: #FFFFFF;
`;

const HeaderToolDiv=styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100px;
  height: 65px;
  position: fixed;
  right: 0;
`
const LoadingDiv=styled.div`
  width: 40px;
  height: 40px;
  line-height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  right: 100px;
`
const LoadingImg=styled.img`
  width: 40px;
  object-fit: cover;
`
const LogoImg=styled.img`
  width: 50px;
  object-fit: cover;
`
const ReFreshIcon=styled(IconDiv)`
  cursor: pointer;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${ReFresh}) ;
  background-color: transparent;
`
//Nav區 包含Logo
const NavDiv=styled.div`
  width: 100%;
  max-width: 180px;
  display: flex;
  position: fixed;
  left: 0;
  top: 0;
  align-items: center;
  justify-content: center;
`
const NavIcon=styled(IconDiv)`
  cursor: pointer;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${Nav}) ;
  background-color: transparent;
`

const LogoDiv=styled.div`
  width: 130px;
  height: 65px;
  display: flex;
  align-items: center;

`
const LogoText=styled(H3)`
  color:#5F6368;
  font-size:18px;
  text-decoration: none;
`

const HeaderDiv = ({isLoggin}) => {
  const {isLoading,setIsLoading,setIsRefresh,navClick,getNavClick} =useContext(HeaderLoadContext);


  useEffect(()=>{

    setIsLoading(false);
  },[]);
  
  return (
    <Header>

      <NavDiv>
      {isLoggin?<NavIcon onClick={()=>getNavClick()}></NavIcon>:null}
        <Link to={"/"} style={{ textDecoration: 'none' }}>
        <LogoDiv  >
        <LogoImg src={KeepLogo}></LogoImg>
        <LogoText>KeepNote</LogoText>
        </LogoDiv>
        </Link>
      </NavDiv>

      {isLoggin?
      <>
       <Search />
      <LoadingDiv>
      {isLoading 
      ? <LoadingImg src={Loading}></LoadingImg>
      :<ReFreshIcon onClick={()=> setIsRefresh(true)}><IconTipText>重新整理</IconTipText></ReFreshIcon>}
      </LoadingDiv> 
      </>
      :null}
      <HeaderToolDiv>
      {isLoggin?
      <>
      <LogOut />
      <Link to={"/membership"} style={{ textDecoration: 'none' }}>
          <User isLoggin={isLoggin}/>
      </Link>
      </>
      :<LogIn />
      }
      </HeaderToolDiv>
    </Header>
  );
};

export default HeaderDiv;

export const HeaderArchiveDiv = ({isLoggin,}) => {//For Archive
  const {isLoading,setIsLoading,setIsRefresh,page,navClick,getNavClick} =useContext(HeaderLoadContext);

  useEffect(()=>{

    setIsLoading(false);
  },[]);

  return (
    <Header>
      <NavDiv>
        {isLoggin?<NavIcon onClick={()=>getNavClick()}></NavIcon>:null}
        <Link to={"/"} style={{ textDecoration: 'none' }}>
        <LogoDiv  >
        <LogoImg src={KeepLogo}></LogoImg>
        <LogoText>KeepNote</LogoText>
        </LogoDiv>
        </Link>
      </NavDiv>
      {isLoggin?
      <>
      <LoadingDiv>
      {isLoading 
      ? <LoadingImg src={Loading}></LoadingImg>
      :<ReFreshIcon onClick={()=> setIsRefresh(true)}><IconTipText>重新整理</IconTipText></ReFreshIcon>}
      </LoadingDiv> 
      </>
      :null}
      <HeaderToolDiv>
      {isLoggin?
      <>
      <LogOut />
      <Link to={"/membership"} style={{ textDecoration: 'none' }}>
          <User isLoggin={isLoggin}/>
      </Link>
      </>
      :<LogIn />
      }
      </HeaderToolDiv>
    </Header>
  );
};


