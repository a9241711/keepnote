import { useContext, useEffect,useState } from "react";
import styled from "styled-components";
import NoteEdit from "./components/NoteEdit";
import NoteList from "./components/NoteList";
import { getAllLists, getTextData } from "../store/HandleDb";
import { Media_Query_SM,Media_Query_MD,Media_Query_SMD } from "../components/constant";
import HeaderLoadContext from "../header/HeaderLoadContext";
import NoteReducer from "./context/NoteReducer";
import SearchContext from "../header/components/SearchContext";




const NoteContent=styled.div`
    max-width:1200px;
    width:95%;
    display:flex;
    flex-direction: column;
    align-items: center;
    ${Media_Query_MD}{
        width:95%;
    }
    ${Media_Query_SMD}{
        width:95%;
    }
    ${Media_Query_SM}{
        width:95%;
    }
`
const NotePage=({isLoggin})=>{
    const uid=isLoggin["uid"]
    const[textData,setTextData]=useState([]);
    const[isDataChange,setDataChanged]=useState(false);
    const{setIsLoading,isRefresh,setIsRefresh}=useContext(HeaderLoadContext);
    const{getOriginData,filterData,clearFilterData,getFilterButDataChange}=useContext(SearchContext);
    const{isFilter}=filterData;


    useEffect(()=>{
        setIsLoading(true);
        async function getListData(){
            await getAllLists(getFilterButDataChange,isFilter,getOriginData,setTextData,uid);
        }
        console.log("index")
        getListData();
        setDataChanged(false);
        setTimeout(()=>setIsLoading(false),1000);
        setIsRefresh(false);
    },[isDataChange,isRefresh])


    return(

        <NoteContent>   
            <NoteReducer>
            <NoteEdit setDataChanged={setDataChanged} addData={setTextData} setList={textData} uid={uid} />
            {textData || isDataChange
            ?<NoteList isDataChange={isDataChange} setDataChanged={setDataChanged} setList={textData} addData={setTextData} deleteData={setTextData} updateData={setTextData} uid={uid}/>
            :<p>Show something</p>}
            </NoteReducer>
        </NoteContent>
    )
}

export default NotePage