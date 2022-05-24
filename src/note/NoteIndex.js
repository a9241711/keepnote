import { useContext, useEffect,useState } from "react";
import styled from "styled-components";
import NoteEdit from "./components/NoteEdit";
import NoteList from "./components/NoteList";
import { getAllLists, getTextData } from "../store/HandleDb";
import {Media_Query_LG, Media_Query_SM,Media_Query_MD,Media_Query_SMD ,H3} from "../components/constant";
import HeaderLoadContext from "../header/HeaderLoadContext";
import NoteReducer from "./context/NoteReducer";
import SearchContext from "../header/components/SearchContext";
import Loading from "./components/loading/Loading";
import { KeepLogo } from "../assets";




const NoteContent=styled.div`
    max-width:1200px;
    width: 100%;
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
    ${Media_Query_LG}{
        padding-left: 80px;
    }
`
const InitialDiv=styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20vh;
`
const InitialImg=styled.div`
    background-size: 120px 120px;
    height: 120px;
    margin: 20px;
    opacity: .5;
    width: 120px;
    background-image: url(${KeepLogo});
`
const InitialText=styled.div`
    color: #80868b;
    cursor: default;
    font-family: "Google Sans",Roboto,Arial,sans-serif;
    font-size: 1.375rem;
    font-weight: 400;
    letter-spacing: 0;
    line-height: 1.75rem;
`
const NotePage=({isLoggin})=>{
    const uid=isLoggin["uid"]
    const[textData,setTextData]=useState([]);
    const[isDataChange,setDataChanged]=useState(false);
    const{setIsLoading,isRefresh,setIsRefresh,isLoading}=useContext(HeaderLoadContext);
    const{getOriginData,filterData,errorData,clearFilterData,getFilterButDataChange}=useContext(SearchContext);
    const{isFilter}=filterData;

    useEffect(()=>{
        setIsLoading(true);
        async function getListData(){
            await getAllLists(getFilterButDataChange,isFilter,getOriginData,setTextData,uid);
        }
        getListData();
        setDataChanged(false);
        setIsRefresh(false);
    },[isDataChange,isRefresh])


    return(

        <NoteContent>   
            <NoteReducer>
           
            {errorData!==null
            ? <InitialDiv>                   
            <InitialImg></InitialImg>
            <InitialText>查無資料，請重新輸入關鍵字</InitialText>
             </InitialDiv>
            :<> <NoteEdit setDataChanged={setDataChanged} addData={setTextData} setList={textData} uid={uid} />
            {textData.length>0
            ?   <>
                <NoteList isDataChange={isDataChange} setDataChanged={setDataChanged} setList={textData} addData={setTextData} deleteData={setTextData} updateData={setTextData} uid={uid}/>
                </>
            :<>            
                {isLoading
                ?<Loading />
                :null}
                <InitialDiv>
                    <InitialImg></InitialImg>
                    <InitialText>你新增的記事會顯示在這裡</InitialText>
                </InitialDiv></>}
            </>}
            </NoteReducer>
        </NoteContent>
    )
}

export default NotePage