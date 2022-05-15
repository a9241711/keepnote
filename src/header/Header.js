import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { H1, H2, H3, Text } from "../components/constant";
import Search from "./Search";
import LogOut from "./LogOut";
import LogIn from "./LogIn";
import User from "./User";
import { Link } from "react-router-dom";
import { KeepLogo, Loading } from "../assets";
import HeaderLoadContext from "./HeaderLoadContext";


const Header = styled.div`
  width: 100%;
  height: 65px;
  position: fixed;
  display: flex;
  border-bottom: 1px solid rgb(218, 220, 224);
  align-items: center;
  justify-content: space-around;
  padding: 0 25px;
  z-index: 999;
  background: #FFFFFF;
`;

const HeaderToolDiv=styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100px;
  height: 65px;
`
const LoadingDiv=styled.div`
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background-image: url(${Loading});
  background-position: center;
  background-size: contain;
`
const LogoDiv=styled.div`
  width: 130px;
  height: 65px;
  display: flex;
  align-items: center;
`
const LogoImg=styled.img`
  width: 65px;
  object-fit: cover;
`
const LogoText=styled(H3)`
  color:#5F6368;
  font-size:20px;
`

const HeaderDiv = ({isLoggin}) => {
  const {isLoading,setIsLoading} =useContext(HeaderLoadContext);
  useEffect(()=>{
    setIsLoading(false);
  },[])
  return (
    <Header>
      <LogoDiv>
        <LogoImg src={KeepLogo}></LogoImg>
        <LogoText>KeepNote</LogoText>
      </LogoDiv>
      <Search></Search>
      {isLoading 
      ? <LoadingDiv></LoadingDiv> 
      :null}
      <HeaderToolDiv>
      {isLoggin?
      <>
      <LogOut /><User isLoggin={isLoggin}/></>
      :<LogIn />
      }
      </HeaderToolDiv>
    </Header>
  );
};

export default HeaderDiv;
