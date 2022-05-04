import { useContext, useEffect,useState } from "react";
import styled from "styled-components";
import NoteEdit from "./components/NoteEdit";
import NoteList from "./components/NoteList";
import { getAllLists, getTextData } from "../store/HandleDb";
import { Media_Query_SM,Media_Query_MD } from "../components/constant";
import HeaderLoadContext from "../header/HeaderLoadContext";



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

const NotePage=({isLoggin})=>{
    const uid=isLoggin["uid"]
    const[textData,setTextData]=useState([]);
    const[isDataChange,setDataChanged]=useState(false);
    const{setIsLoading}=useContext(HeaderLoadContext);

    // const[uid,setUid]=useState(localStorage.getItem("token"))
    useEffect(()=>{
        setIsLoading(true);
        async function getListData(){
            await getAllLists(setTextData,uid);
        }
        getListData();
        setDataChanged(false);
        setTimeout(()=>setIsLoading(false),1000)
    },[isDataChange])


    return(
        <NoteContent>
            <NoteDiv>
                <NoteEdit setDataChanged={setDataChanged} addData={setTextData} setList={textData} uid={uid} />
            </NoteDiv>
            {textData.length>0 || isDataChange
            ?<NoteList setDataChanged={setDataChanged} setList={textData} addData={setTextData} deleteData={setTextData} updateData={setTextData} uid={uid}/>
            :<p>Show something</p>}
        </NoteContent>
    )
}

export default NotePage