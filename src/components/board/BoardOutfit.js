import styled from "styled-components";
import { Media_Query_SM,Media_Query_MD,Media_Query_SMD } from "../constant";


const OutFitDiv=styled.div`
    display: flex; 
    ${Media_Query_SM}{
        width: 100%;
        background-color: #FFFFFF;
        position:fixed;
        left:10px;
        bottom:0;
    }
    ${Media_Query_SMD}{
        width: 100%;
        background-color: #FFFFFF;
        position:fixed;
        left:10px;
        bottom:0;
    }
    /* ${Media_Query_MD}{
        width: 100%;
        background-color: #FFFFFF;
        position:fixed;
        left:10px;
        bottom:0;
    } */
`
const ToolDiv=styled.div`
    width: 52px;
    height: 52px;
    position:relative;
    box-sizing:border-box;
    margin: 10px 0px;
    display: flex;
    align-items: center;
    justify-content: center;
`
const SelectOutfitBtn=styled.input`
    width:32px;
    height:32px;
`
const SelectRangeBtn=styled(SelectOutfitBtn)`
      width:100px;
      height:16px;
      position:absolute;
      left: 0px;
      appearance:none;
      opacity:0.7;
      transition:opacity .2s;
      background:#d3d3d3;
      margin-left: 15px;
      border-radius: 10px 10px;
      &:hover{
          opacity:1;
      }
      &::-webkit-slider-thumb{
          appearance:none;
          width:20px;
          height:20px;
          background:black;
          cursor:pointer;
          border-radius: 50%;
          background: #565656
      }
`

const BoardOutfit=({setColor,setRange,color,range})=>{

    return(
        <>
        <OutFitDiv>
        <ToolDiv>
        <SelectOutfitBtn
          type="color"
          id="strokeColor"
          value={color.fillColor}
          onChange={(e) => setColor({
            strokeColor: e.target.value})}
        />
        </ToolDiv>
        <ToolDiv>
        <SelectRangeBtn
          type="range"
          id="range"
          min={1}
          max={9}
          step={2}
          value={range}
          onChange={(e) => setRange(e.target.value)}
        />
        </ToolDiv>
        </OutFitDiv>
        </>
    )


}

export default BoardOutfit