import { useEffect,useState } from "react";
import styled from "styled-components";
import NoteEdit from "./components/NoteEdit";
import NoteList from "./components/NoteList";
import { collection,getDocs,data, orderBy, query } from "firebase/firestore";
import { db } from "../store/firebase";
import { getTextData } from "../store/HandleDb";
// import CanvasTool from "./components/CanvasTool";

const NoteContent=styled.div`
width:1200px;
display:flex;
flex-direction: column;
align-items: center;
`

const NoteDiv=styled.div`
width:600px;
position:relative;
box-sizing:border-box;
box-shadow:0 1px 2px 0 rgb(60 64 67/30%), 
0 2px 6px 2px rgb(60 64 67 /15%);
border-radius:8px;
margin-top:33px;
padding: 10px;
background-color: #ffffff;
`

const NotePage=()=>{
    const[textData,setTextData]=useState([]);

    useEffect(()=>{
        getTextData(setTextData);
    },[])


    return(
        
        <NoteContent>
        <NoteDiv>
            <NoteEdit addData={setTextData} setList={textData} />
            
        </NoteDiv>
            <NoteList setList={textData} addData={setTextData} deleteData={setTextData} updateData={setTextData}/>
        </NoteContent>
    )
}

export default NotePage