import styled from "styled-components";
import { useState,useRef, useEffect, useContext } from "react";
import { IconDiv,IconTipText,scaleBottom, Media_Query_SM,scaleRight } from "../../../components/constant";
import { ColorPalette, LeftArrow } from "../../../assets";
import { updateNoteData } from "../../../store/HandleDb";
import NoteContext from "../../context/NoteContext";

const ColorDiv=styled.div`

`     
const ColorIcon=styled(IconDiv)`
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${ColorPalette}) ;
  &:hover{
    cursor: pointer;
  }
`      
const ColorInputDiv=styled(IconDiv)`
    width: fit-content;
    height:50px;
    background-color: #FFFFFF;
    position: absolute;
    top: 45px;
    left:0;
    z-index: 0;
    border-radius: 8px;
    border: none;
    display: flex;
    justify-content: flex-start;
    padding: 5px 10px;
    box-shadow: 0 1px 2px 0 rgb(60 64 67/30%), 0 2px 6px 2px rgb(60 64 67 /15%);
    z-index: 5;
    &:hover{
        background-color: #FFFFFF;
        border-radius:unset;
    }
`
const IconToolTipText=styled.span`
    font-size: 12px;
    visibility: hidden;
    background-color: rgba(0,0,0,0.8);
    color: #fff;
    text-align: center;
    border-radius: 6px;
    padding: 5px;
    position: absolute;
    top:100%;
    left: 0;
    word-break: keep-all;
`
const ColorRedBtn=styled.button`
    width:32px;
    height:32px;
    z-index: 0;
    border-radius: 50%;
    background-color: #F28B82;
    border: none;
    margin: 0 2.5px;
    position: relative;
    &:hover{
        border-radius: 50%;
        border:1px solid black;
        cursor: pointer;
    }
    &:hover ${IconToolTipText}{
        visibility: visible;
    }
`

const ColorYellowBtn=styled(ColorRedBtn)`
    background-color: #FFF475;

`
const ColorGreenBtn=styled(ColorRedBtn)`
    background-color: #CCFF90;
`
const ColorBlueBtn=styled(ColorRedBtn)`
    background-color: #AECBFA;
`
const ColorPurpleBtn=styled(ColorRedBtn)`
    background-color: #D7AEFB;
`
const ColorWhiteBtn=styled(ColorRedBtn)`
    border:1px solid #CCC;
    background-color: #FFFFFF;
`

const NoteColor=({uid,id, selected,setList,setDataChanged,setNoteColor,isFromEdit,isColorPopUpEdit,setPopUpColor})=>{
    const[clickColor,setClickColor]=useState(false);
    const currentRef=useRef();//用來判斷是否為該物件
    const colorIconRef=useRef();
    const{getColorUpdate}=useContext(NoteContext);

    const handelClickColor= async(e)=>{
        if(isFromEdit){ return setNoteColor(e.target.value)}//判斷是從note Edit來的，不是從List來的
        getColorUpdate(e.target.value);
        //List修改視窗
        const updateColorElements = {
            color:e.target.value,
          };
        await updateNoteData(id, updateColorElements,uid);//回傳DB
        setDataChanged(true);
      }

    useEffect(()=>{//觀察是否click到非color icon
        const handleClickColorIcon=(e)=>{
            console.log(e.target,colorIconRef.current.contains(e.target));
            if(!colorIconRef.current.contains(e.target)){
                return setClickColor(false);
            }
        }
        if(clickColor){
            console.log("click colorIcon",colorIconRef.current,);
            document.addEventListener("click",handleClickColorIcon);
        }
        return ()=>{ document.removeEventListener("click",handleClickColorIcon)};//取消觀察
    },[clickColor])

    return(
        <>
        <ColorDiv ref={colorIconRef}>
        <ColorIcon  onClick={()=>  setClickColor(!clickColor) }>
        <IconTipText   >背景選項</IconTipText>
        </ColorIcon>
  
        {clickColor
        ?<ColorInputDiv ref={currentRef} >
        <ColorWhiteBtn value="#FFFFFF" onClick={(e)=> handelClickColor(e)}><IconToolTipText>預設</IconToolTipText></ColorWhiteBtn>
        <ColorRedBtn value="#F28B82" onClick={(e)=> handelClickColor(e)}><IconToolTipText>紅色</IconToolTipText></ColorRedBtn>
        <ColorYellowBtn value="#FFF475" onClick={(e)=> handelClickColor(e)}><IconToolTipText>黃色</IconToolTipText></ColorYellowBtn>
        <ColorGreenBtn value="#CCFF90" onClick={(e)=> handelClickColor(e)}><IconToolTipText>綠色</IconToolTipText></ColorGreenBtn>
        <ColorBlueBtn value="#AECBFA" onClick={(e)=> handelClickColor(e)}><IconToolTipText>藍色</IconToolTipText></ColorBlueBtn>
        <ColorPurpleBtn value="#D7AEFB" onClick={(e)=> handelClickColor(e)}><IconToolTipText>紫色</IconToolTipText></ColorPurpleBtn>
        </ColorInputDiv>
        :null}
        </ColorDiv>
        </>
    )
}
export default NoteColor;

//Color PopUp Icon div
export const NoteColorElement=({setClickColor,clickColor})=>{

    return(
        <ColorIcon  onClick={()=>  setClickColor(!clickColor) }>
        <IconTipText   >背景選項</IconTipText>
        </ColorIcon>
    )
}
const NoteListColorDiv=styled.div`
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(121, 122, 124, 0.6);
    z-index:999;
    ${Media_Query_SM}{
      display: block;

  }
`

const ColorInputPopDiv=styled(ColorInputDiv)`
    border-radius: 8px;
    left: 20%;
    top: 37px;
    animation: ${scaleRight}  0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    ${ Media_Query_SM}{
        z-index:4001;
        width: 100%;
        height: 100px;
        justify-content: space-around;
        padding: unset;
        border-radius: unset;
        left: 0;
        top: unset;
        bottom: 0;
        box-shadow: unset;
        animation:${scaleBottom} 0.3s cubic-bezier(0.250, 0.460, 0.450, 0.940) both; 
    }
`
const LeftArrowDiv=styled(IconDiv)`
        display: none;
        background-repeat: no-repeat;
        background-position: center;
        background-image: url(${LeftArrow}) ;
        ${ Media_Query_SM}{display:block}
`

export const NoteColorPop=({id,uid,clickColor,setDataChanged,setClickColor,})=>{//彈出視窗PopUp Color
    const{getColorUpdate,selcetedItem}=useContext(NoteContext);
    const colorRef=useRef();
    const handelClickColor= async(e)=>{
        const updateColorElements = {
            color:e.target.value,
          };
        await updateNoteData(id, updateColorElements,uid);//回傳DB
        setDataChanged(true);
        getColorUpdate(e.target.value);
      }

    return(
        <>
        {clickColor?
        <>
            <NoteListColorDiv></NoteListColorDiv>
            <ColorInputPopDiv  ref={colorRef}>
            <LeftArrowDiv onClick={()=>setClickColor(false)}></LeftArrowDiv>
            <ColorWhiteBtn value="#FFFFFF" onClick={(e)=> handelClickColor(e)}><IconToolTipText>預設</IconToolTipText></ColorWhiteBtn>
            <ColorRedBtn value="#F28B82" onClick={(e)=> handelClickColor(e)}><IconToolTipText>紅色</IconToolTipText></ColorRedBtn>
            <ColorYellowBtn value="#FFF475" onClick={(e)=> handelClickColor(e)}><IconToolTipText>黃色</IconToolTipText></ColorYellowBtn>
            <ColorGreenBtn value="#CCFF90" onClick={(e)=> handelClickColor(e)}><IconToolTipText>綠色</IconToolTipText></ColorGreenBtn>
            <ColorBlueBtn value="#AECBFA" onClick={(e)=> handelClickColor(e)}><IconToolTipText>藍色</IconToolTipText></ColorBlueBtn>
            <ColorPurpleBtn value="#D7AEFB" onClick={(e)=> handelClickColor(e)}><IconToolTipText>紫色</IconToolTipText></ColorPurpleBtn>
            </ColorInputPopDiv>
        </>
            :null}
        </>
    )

}