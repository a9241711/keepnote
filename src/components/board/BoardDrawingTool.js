import styled, { keyframes } from "styled-components";
import { useEffect, useState } from "react";
import { BoardContext } from "./BoardIndex";
import { Pencil,PencilCheck,Line,LineCheck,Rectangle,RectangleCheck,Selection,SelectionCheck, Arrow, ArrowCheck } from "../../assets";
import { Link } from "react-router-dom";
import { updateBoardData } from "../../store/HandleDb";

const backgoundColor=keyframes`
from{
  background-color:#999999;
}
to{
  background-color:white;
}
`;

const ToolDiv = styled.div`
  width: 52px;
  height: 52px;
  display:flex;
  position:relative;
  box-sizing:border-box;
  margin: 10px 15px;
`;
const ToolLabel = styled.label`
  display: flex;
  justify-content: center;
  align-items: center;
  width:100%;
  height:100%;
  position:absolute;
  &:hover{
    border:1px solid #ccc;
  }
  &::before{
    content:'';
    display:inline-block;
    width: 32px;
    height: 32px;
    background-image:url(${Pencil});
    position:absolute;
    background-repeat: no-repeat;
    background-size: auto;
  }
  &:hover:before{
    cursor:pointer;
    background-image:url(${PencilCheck}) 
    }
`;
const ToolBtn=styled.input`
    opacity: 0;
    position: absolute;
    &:checked + ${ToolLabel}{
      animation:${backgoundColor} 0.3s linear;
      :before{
      background-image:url(${PencilCheck}) 
        }
      }
`

const RectLabel=styled(ToolLabel)`
    &::before{
      background-image:url(${Rectangle})}
    &:hover:before{
      background-image:url(${RectangleCheck}) 
      }
`
const RectangleToolBtn=styled(ToolBtn)`
    &:checked + ${RectLabel}{
    :before{
      background-image:url(${RectangleCheck}) 
      }
      }

`

const LineLabel=styled(ToolLabel)`
    &::before{
      background-image:url(${Line})}
    &:hover:before{
      background-image:url(${LineCheck}) 
      }
`
const LineToolBtn=styled(ToolBtn)`
    &:checked + ${ToolLabel}{
    :before{
      background-image:url(${LineCheck}) 
      }
      }
`
const SelectionLabel=styled(ToolLabel)`
    &::before{
      background-image:url(${Selection})}
    &:hover:before{
      background-image:url(${SelectionCheck}) 
      }
`
const SelectToolBtn=styled(ToolBtn)`
    &:checked + ${SelectionLabel}{
      :before{
        background-image:url(${SelectionCheck}) 
        }
        }
`
const GoBackPrePageBtn=styled.button`
  width: 52px;
  height: 52px;
  box-sizing: border-box;
  margin: 10px 20px;
  background:none;
  border:none;
  &:hover{
  border:1px solid #ccc;
  }
  &::before{
    content:'';
    display:inline-block;
    width: 32px;
    height: 32px;
    background-image:url(${Arrow});
    background-repeat: no-repeat;
    background-size: auto;
  }
  &:hover:before{
    cursor:pointer;
    background-image:url(${ArrowCheck}) 
    }
`


const BoardDrawingTool = ({tool,setTool,id ,elements,uid}) => {
  const saveBoardToDb= async()=>{
    // await updateBoardData()
    const canvas = document.getElementById("canvas");
    const url=canvas.toDataURL();
    await updateBoardData(id,url,uid);//存入base64
  }

 function refreshPage(){
   setTimeout(()=>{
    window.location.reload();
   },500)
   console.log('reload page');
  }

  return (
    <>
      <Link to={"/"} onClick={refreshPage}>
      <GoBackPrePageBtn  onClick={saveBoardToDb}/>
        </Link>
      <ToolDiv>
        <SelectToolBtn
          type="radio"
          id="selection"
          checked={tool === "selection"}
          onChange={() => {
            setTool("selection");
          }}
        />
        <SelectionLabel htmlFor="selection"></SelectionLabel>
      </ToolDiv>
      <ToolDiv>
        <LineToolBtn
          type="radio"
          id="line"
          checked={tool === "line"}
          onChange={() => {
            setTool("line");
          }}
        />
        <LineLabel htmlFor="line"></LineLabel>
      </ToolDiv>
      <ToolDiv>
        <RectangleToolBtn
          type="radio"
          id="rectangle"
          checked={tool === "rectangle"}
          onChange={() => {
            setTool("rectangle");
          }}
        />
        <RectLabel htmlFor="rectangle"></RectLabel>
      </ToolDiv>
      <ToolDiv>
        <ToolBtn
          type="radio"
          id="pencil"
          checked={tool === "pencil"}
          onChange={() => {
            setTool("pencil");
          }}
        />
        <ToolLabel htmlFor="pencil"></ToolLabel>
      </ToolDiv>
    </>
  );
};

export default BoardDrawingTool;
