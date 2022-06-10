import { useState } from "react";
import styled from "styled-components";
import { Undo,UndoCheck,Redo,RedoCheck, Menu, MenuCheck,Banned, Delete } from "../../assets";
import { deleteBoard } from "../../store/HandleDb";
import { ClickIconAnimate, Media_Query_MD, Media_Query_SM,Media_Query_SMD  } from "../constant";



const BoardSetpDiv=styled.div`
    display: flex;
    position: fixed;
    right: 0;
    box-sizing: border-box;
    ${Media_Query_SM}{

      right:10px;
      bottom: 0;
    }
    ${Media_Query_SMD}{
      position: fixed;
      right:10px;
      bottom: 0;
    }
`
const UndoBtn=styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 52px;
  height: 52px;
  box-sizing: border-box;
  margin: 10px 0px;
  background:none;
  border:none;
  &::before{
    content:'';
    display:inline-block;
    width: 32px;
    height: 32px;
    background-image:url(${UndoCheck});
    background-repeat: no-repeat;
    background-size: auto;
  }
  &:hover{
    cursor:pointer;
    }
  &:active{
    animation:${ClickIconAnimate} 0.3s linear;
    }
`
const RedoBtn=styled(UndoBtn)`
  &::before{
    background-image:url(${RedoCheck});
  } 
  &:hover:before{
    cursor:pointer;
    }
  &:active{
    animation:${ClickIconAnimate} 0.3s linear;
  }
`
const DeleteBtn=styled(UndoBtn)`//手機版顯示
    display:none;
  &::before{
    background-image:url(${Delete});
  } 
  &:active{
    animation:${ClickIconAnimate} 0.3s linear;
  }
  ${Media_Query_SM}{
    display: flex;
  }
  ${Media_Query_SMD}{
    display: flex;
  }
  ${Media_Query_MD}{
    display: flex;
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
  ${Media_Query_SM}{//非桌機版則不顯示
    display: none;
  }
  ${Media_Query_SMD}{
    display: none;
  }
  ${Media_Query_MD}{
    display: none;
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
    top: 65px;
    display:${props=>(props.menu ==true? "block" :"none" )};
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

const BoardStep=({undo,redo,clear,id,currentIndex,uid})=>{
    const[menu,setMenu]=useState(false);//handle menu

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
    }
    const handleRedo=()=>{//設定undo跟redo的按鈕顯示
      redo();
    }
    const handleClear=async()=>{
      clear();
      await deleteBoard(id,uid);
    }

    return(
        <>
        <BoardSetpDiv >
        <UndoBtn onClick={handleUndo} ></UndoBtn>
        <RedoBtn onClick={handleRedo} ></RedoBtn>
        <MenuBtn id="menuBtn" onClick={()=>setMenu(!menu)} >
            <MenuDropDown menu={menu} >
                <MenuDropDowndBtn  onClick={download}>下載圖片</MenuDropDowndBtn>
                <MenuDropDowndBtn  onClick={handleClear}>清除頁面</MenuDropDowndBtn>
            </MenuDropDown>
        </MenuBtn>
        <DeleteBtn onClick={handleClear}></DeleteBtn>
        </BoardSetpDiv>
        </>
    )
}

export default BoardStep