import styled from "styled-components";


const ToolDiv=styled.div`
    width: 52px;
    height: 52px;
    position:relative;
    box-sizing:border-box;
    margin: 10px 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    }
`
const SelectOutfitBtn=styled.input`
    width:32px;
    height:32px;
`
const SelectRangeBtn=styled(SelectOutfitBtn)`
      width:100px;
      height:25px;
      position:absolute;
      left: 0px;
      appearance:none;
      opacity:0.7;
      transition:opacity .2s;
      background:#d3d3d3;
      &:hover{
          opacity:1;
      }
      &::-webkit-slider-thumb{
          appearance:none;
          width:10px;
          height:25px;
          background:black;
          cursor:pointer;
      }
`

const BoardOutfit=({setColor,setRange,color,range})=>{

    return(
        <>
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
        </>
    )


}

export default BoardOutfit