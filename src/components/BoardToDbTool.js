import styled from "styled-components";
import { saveBoardData,getBoardData } from "../store/HandleDb";
import { db } from "../store/firebase";
import { collection,setDoc,doc ,addDoc} from "firebase/firestore";
// import {getDatabase,ref,set,push,} from "firebase/database";




const BoardBottom=styled.div`
width:100%;
position:fixed;
bottom:0;
`

const BoardSaveBtn=styled.button`
    width:100px
`
const BoardShowBtn=styled.button`
    width:100px
`
const BoardDownloadBtn=styled.button`
    width:100px
`
const BoardGetDataBtn=styled.button`
width:100px
`
const BoardToDbTool=({elements,setIsData,setElements})=>{
    const show=()=>{
        const showCanvas=document.getElementById("canvas");
        const ctx=showCanvas.getContext("2d");
        const imgage=new Image();
        imgage.onload=function(){
            ctx.drawImage(imgage,0,0)
        }
        imgage.src=""
    }
    const save= async()=>{
        saveBoardData(elements)
      }
      const download=()=>{
        const canvas = document.getElementById("canvas");
        let image=canvas.toDataURL("image/png");
        let link=document.createElement('a');
        link.download="my-download";
        link.href=image;
        link.click()
      }

      const getData= async()=>{
        const getBoardElements=await getBoardData();
        setIsData(getBoardElements);
      }
    return(
        <>
        <BoardBottom>
        <BoardShowBtn onClick={show}>Show</BoardShowBtn>
        <BoardSaveBtn onClick={save}>
        Save
        </BoardSaveBtn>
        <BoardDownloadBtn onClick={download} >
        download
        </BoardDownloadBtn>
        <BoardGetDataBtn onClick={getData}>
            getData
        </BoardGetDataBtn>
        </BoardBottom>
        </>

    )

}

export default BoardToDbTool