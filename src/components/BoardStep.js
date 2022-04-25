import { useEffect } from "react";
import { useState,useRef } from "react";
import styled,{keyframes} from "styled-components";
import { Undo,UndoCheck,Redo,RedoCheck, Menu, MenuCheck,Banned } from "../assets";

const backgoundColor=keyframes`
  from{
    background-color:#999999;
  }
  to{
    background-color:white;
  }
`;

const BoardSetpDiv=styled.div`
    position:fixed;
    right:0;
`
const UndoBtn=styled.button`
  width: 52px;
  height: 52px;
  box-sizing: border-box;
  margin: 10px 20px;
  background:none;
  border:none;
  &:hover{
    border:(${props=> {return props.minLength==="false"? "1px solid #ccc": "none"}});;
  }
  &::before{
    content:'';
    display:inline-block;
    width: 32px;
    height: 32px;
    background-image:url(${props=> {return props.minLength==="false"?UndoCheck: Undo}});
    background-repeat: no-repeat;
    background-size: auto;
  }
  &:hover:before{
    cursor:pointer;
    background-image:url(${props=> {return props.minLength==="false"?UndoCheck: Banned}});
    }
  &:active{
      animation:${backgoundColor} 0.3s linear;
    }
`
const RedoBtn=styled(UndoBtn)`
&::before{
    background-image:url(${props=> {return props.maxLength==="false"?RedoCheck:Redo}});
  } 
  &:hover:before{
    background-image:url(${props=> {return props.maxLength==="false"?RedoCheck: Banned}}) 
    }
`
const MenuBtn=styled(UndoBtn)`
  position:relative;
  &::before{
    background-image:url(${Menu});
  }
  &:hover:before{
    background-image:url(${MenuCheck}) 
    }
`
const MenuDropDown=styled.div`
    width:120px;
    position:absolute;
    right:0;
    background:#fff;
    border:none;
    padding:8px 0 4px;
    box-shadow:0px 1px 2px 0px rgb(60 64 67/ 30%), 0px 2px 6px 2px rgb(60 64  67/15%);
    display:flex;
    flex-direction:column;
    margin-top:5px;
    display:${props=>(props.menu!=="menu"? "none" :"block" )};
`
const MenuDropDowndBtn=styled.button`
    font-size: 14px;
    width: 100%;
    height:32px;
    border: none;
    height: 32px;
    margin: 5px 0;
    text-align: start;
    padding-left:8px;
    background:none;
    &:hover{
        background:#CCCCCC;
        cursor:pointer;
    }
`

const BoardStep=({undo,redo,clear,elements,currentIndex})=>{
    const[menu,setMunu]=useState("");
    const[maxLength,setMaxLength]=useState("false");
    const[minLength,setMinLength]=useState("false");
    const MunuBtnRef=useRef();
    useEffect(()=>{//設定MenuBtn的顯示與消失動作
      document.addEventListener("click",(e)=>{
        if(!MunuBtnRef.current.contains(e.target)){
          setMunu("")
      }})
    },[menu])

    useEffect(()=>{
   
    },[maxLength,minLength])

    const download=()=>{
      const canvas = document.getElementById("canvas");
      let image=canvas.toDataURL("image/png");
      let link=document.createElement('a');
      link.download="my-download";
      link.href=image;
      link.click()
    }

    const handleUndo=()=>{//設定undo跟redo的按鈕顯示
      undo();
      if(currentIndex<=1){
        setMinLength("true");
        setMaxLength("false");
      }
    }
    const handleRedo=()=>{//設定undo跟redo的按鈕顯示
      redo();
      const maxIndex=elements.length
      if(currentIndex>= maxIndex){
        setMinLength("false");
        setMaxLength("true");
      }
    }

    return(
        <>
        <BoardSetpDiv >
        <UndoBtn onClick={handleUndo} minLength={minLength}></UndoBtn>
        <RedoBtn onClick={handleRedo} maxLength={maxLength}></RedoBtn>
        <MenuBtn id="menuBtn" ref={MunuBtnRef} onClick={()=>{setMunu("menu")}} >
            <MenuDropDown menu={menu} >
                <MenuDropDowndBtn  onClick={download}>下載圖片</MenuDropDowndBtn>
                <MenuDropDowndBtn  onClick={clear}>清除頁面</MenuDropDowndBtn>
            </MenuDropDown>
        </MenuBtn>
        </BoardSetpDiv>
        </>
    )
}

export default BoardStep