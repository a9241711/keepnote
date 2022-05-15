import { useContext, useEffect,useState } from "react";
import styled from "styled-components";
import NoteEdit from "./components/NoteEdit";
import NoteList from "./components/NoteList";
import { getAllLists, getTextData } from "../store/HandleDb";
import { Media_Query_SM,Media_Query_MD } from "../components/constant";
import HeaderLoadContext from "../header/HeaderLoadContext";
import NoteReducer from "./context/NoteReducer";




const NoteContent=styled.div`
    width:1200px;
    display:flex;
    flex-direction: column;
    align-items: center;
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
        console.log("index")
        getListData();
        setDataChanged(false);
        setTimeout(()=>setIsLoading(false),1000)
    },[isDataChange])


    return(

        <NoteContent>   
            <NoteReducer>
            <NoteEdit setDataChanged={setDataChanged} addData={setTextData} setList={textData} uid={uid} />
            {textData.length>0 || isDataChange
            ?<NoteList setDataChanged={setDataChanged} setList={textData} addData={setTextData} deleteData={setTextData} updateData={setTextData} uid={uid}/>
            :<p>Show something</p>}
            </NoteReducer>
        </NoteContent>
    )
}

export default NotePage