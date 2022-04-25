import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { H1, H2, H3, Text } from "../components/constant";
import Search from "./Search";
import { ThemeContext } from "../store/index";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
body{
  padding:0;
  margin:0;
  list-style:none;
  font-family:"Google Sans", Roboto, Arial, sans-serif;
  color: #202124;
  font-weight: 400;
  font-size: 16px;
}
`;

const HeaderDiv = () => {
  // const { dark, light } = useContext(ThemeContext);
  const Header = styled.div`
    width: 100%;
    height: 65px;
    position: fixed;
    display: flex;
    border-bottom: 1px solid rgb(218, 220, 224);
    align-items: center;
    padding: 0 25px;
  `;
  return (
    <Header>
      <GlobalStyle />
      <H3> </H3>
      <Text>測試</Text>
      <Search></Search>
    </Header>
  );
};

export default HeaderDiv;
