import { useState, useEffect, useContext } from "react";
import styled from "styled-components";
import { Close,SearchImg } from "../assets";
import { IconTipText, Media_Query_MD, Media_Query_SM,Media_Query_SMD,scaleRight} from "../components/constant";
import SearchContext from "./components/SearchContext";
import { IconDiv } from "../components/constant";

const SearchBar = styled.div`
  background-color:${props=>props.isFocus?"transparent":"#f1f3f4"} ;
  border: 1px solid transparent;
  box-shadow: rgb(65 69 73 / 30%) 0px 1px 1px 0px,
    rgb(65 69 73 / 15%) 0px 1px 3px 1px;
  border-radius: 8px;
  width: 620px;
  height: 46px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  position: relative;
  padding: 0;
  box-sizing: border-box;
  position: fixed;
  left: 160px;
  ${Media_Query_MD}{
      width: 520px;
      right: 160px;
      left: unset;
    }
  ${Media_Query_SMD}{
      max-width: 350px;
      width: 100%;
      width: ${props=> props.show?"40px":"350px"};
      box-shadow:${props=> props.show?"none": "rgb(65 69 73 / 30%) 0px 1px 1px 0px,rgb(65 69 73 / 15%) 0px 1px 3px 1px"} ;
      background-color: ${props=> props.show?"transparent":"#f1f3f4"}; ;
      transition:all linear 1s; 
      right: 160px;
      left: unset;
  }
  ${Media_Query_SM}{
      max-width: 200px;;
      width: 100%;
      width: ${props=> props.show?"40px":"200px"};
      box-shadow:${props=> props.show?"none": "rgb(65 69 73 / 30%) 0px 1px 1px 0px,rgb(65 69 73 / 15%) 0px 1px 3px 1px"} ;
      background-color: ${props=> props.show?"transparent":"#f1f3f4"}; ;
      transition:all linear 1s; 
      right: 160px;
      left: unset;
  }
`;


const SearchInput = styled.input.attrs({
  type: "text",
  placeholder: "搜尋",
})`
  width: 90%;
  height: 46px;
  background-color: transparent;
  border: none;
  text-indent: 40px;
  font-size: 16px;
  outline: none;
  border-radius: 8px;
  ::placeholder {
    font-size: 16px;
    font-family: "Google Sans", Roboto, Arial, sans-serif;
  }
  &:focus {
    background-color: #ffffff;
  }
  ${Media_Query_SMD}{
      /* width: 280px; */
      width: ${props=> props.show?"0px":"90%"};
  }
  ${Media_Query_SM}{
      /* width: 280px; */
      width: ${props=> props.show?"0px":"90%"};
  }
`;
const SearchIcon = styled(IconDiv)`
  cursor: pointer;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${SearchImg}) ;
  background-color: transparent;
  ${Media_Query_SMD}{
    display: none;
  }
  ${Media_Query_SM}{
    display: none;
  }

`;
const SearchIcon2 = styled(IconDiv)`
  display: none;
  ${Media_Query_SMD}{
  cursor: pointer;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${SearchImg}) ;
  background-color:"#FFFFFF" ;
  display: ${props=>props.isFilter?"none":"block"};
  }
  ${Media_Query_SM}{
    cursor: pointer;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${SearchImg}) ;
  background-color:"#FFFFFF" ;
  display: ${props=>props.isFilter?"none":"block"};
  }
`;

const DeleteIcon = styled(IconDiv)`
  cursor: pointer;
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${Close}) ;
  background-color: transparent;
`;

const Search = () => {
  const[searchWord,setSearchWord]=useState("");//Search Word
  const[isFocus,setIsFocus]=useState(false);
  const{dataList,getFilterData,clearFilterData,filterData,filterButDataChange,getFilterButDataChange}=useContext(SearchContext);//取得所有list data
  const originDataList=dataList["dataList"];
  const[show,setShow]=useState(false);
  const{isFilter}=filterData;

  const handleInut=(e)=>{
    setSearchWord(e.target.value);
    if(e.target.value==""){
      clearFilterData();
    }
  }
  const handleInputFilter=(e)=>{
    if(e.keyCode===13){
    e.preventDefault();
    const newFilter=originDataList.filter((item)=>{
      console.log(item,"searchWord",searchWord);
      return item.noteTitle.includes(searchWord) || item.noteText.includes(searchWord);
    });
      console.log("newFilter",newFilter)
      getFilterData(newFilter);//回傳篩選結果給Search
  }
  }
  const handleClear=()=>{
    clearFilterData();
    setSearchWord("");
  }

  useEffect(()=>{//控制已經filter過淡dataChanged
    if(!filterButDataChange) return
    const handleFilter=()=>{
      const filter=originDataList.filter((item)=>{
        return item.noteTitle.includes(searchWord) || item.noteText.includes(searchWord);
      });
        console.log("newFilter",filter)
        getFilterData(filter);//回傳篩選結果給Search
    }
    handleFilter()
    getFilterButDataChange(false)
  },[filterButDataChange])
  return (
    <SearchBar show={show} isFocus={isFocus}>
      <SearchIcon onClick={()=>setShow(!show)}>
      </SearchIcon>
      <SearchInput show={show} value={searchWord} onKeyDown={handleInputFilter} onChange={handleInut} onFocus={()=>setIsFocus(true)} onBlur={()=>setIsFocus(false)}></SearchInput>
      <SearchIcon2   isFilter={isFilter}  onClick={()=> {setShow(!show); setIsFocus(false);}}>
      <IconTipText>搜尋</IconTipText>
      </SearchIcon2>
      {isFilter? 
      <DeleteIcon onClick={handleClear}>
      </DeleteIcon>
      :null}
    </SearchBar>
  );
};

export default Search;
