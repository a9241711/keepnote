import { useState, useEffect } from "react";
import styled from "styled-components";
import deletePng from "./img/x.png";
import searchPng from "./img/search-interface-symbol.png";

const Search = () => {
  return (
    <SearchBar>
      <SearchInput></SearchInput>
      <SearchIcon>
        <SearchIconPng src={`${searchPng}`}></SearchIconPng>
      </SearchIcon>
      <DeleteIcon>
        <DeleteIconPng src={`${deletePng}`} id="deleteBtn"></DeleteIconPng>
      </DeleteIcon>
    </SearchBar>
  );
};
const SearchBar = styled.form`
  background-color: #f1f3f4;
  border: 1px solid transparent;
  box-shadow: rgb(65 69 73 / 30%) 0px 1px 1px 0px,
    rgb(65 69 73 / 15%) 0px 1px 3px 1px;
  border-radius: 8px;
  width: 720px;
  height: 46px;
  position: relative;
  padding: 0;
  margin: auto;
  box-sizing: border-box;
`;

const SearchIcon = styled.div`
  width: 16px;
  position: absolute;
  top: 30%;
  left: 10px;
  &:hover {
    cursor: pointer;
    background-color: #eeeeee;
  }
`;

const SearchIconPng = styled.img`
  width: 100%;
`;

const SearchInput = styled.input.attrs({
  type: "text",
  placeholder: "搜尋",
})`
  width: 100%;
  height: 46px;
  background-color: transparent;
  border: none;
  text-indent: 40px;
  outline: none;
  ::placeholder {
    font-size: 16px;
    font-family: "Google Sans", Roboto, Arial, sans-serif;
  }
  &:focus {
    background-color: #ffffff;
  }
`;

const DeleteIcon = styled.div.attrs({
  id: "DeleteIcon",
})`
  width: 16px;
  position: absolute;
  right: 5%;
  top: 30%;
`;

const DeleteIconPng = styled.img`
  width: 100%;
`;
export default Search;
