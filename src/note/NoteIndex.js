import { useContext, useEffect,useState } from "react";
import styled from "styled-components";
import {Media_Query_LG, Media_Query_SM,Media_Query_MD,Media_Query_SMD } from "../components/constant";
import { KeepLogo } from "../assets";
import NoteEdit from "./components/NoteEdit";
import NoteList from "./components/NoteList";
import NoteReducer from "./context/NoteReducer";
import Loading from "./components/loading/Loading";
import ArchivePop from "./archive/ArchivePop";
import SearchContext from "../header/components/SearchContext";
import HeaderLoadContext from "../header/HeaderLoadContext";
import { getAllLists } from "../store/handledb/NoteDb";


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
    const {uid,email,}=isLoggin;
    const[textData,setTextData]=useState([]);
    const[isDataChange,setDataChanged]=useState(false);
    const{setIsLoading,isRefresh,setIsRefresh,isLoading}=useContext(HeaderLoadContext);
    const{getOriginData,filterData,errorData,clearFilterData,getFilterButDataChange}=useContext(SearchContext);
    const{isFilter}=filterData;
    const[isArchive,setIsArchive]=useState({show:false,id:null});//是否有封存記事

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
            {/* 搜尋錯誤結果顯示 */}
            {errorData!==null
            ?<InitialDiv>                   
                <InitialImg></InitialImg>
                <InitialText>查無資料，請重新輸入關鍵字</InitialText>
             </InitialDiv>
            :<> 
            <NoteEdit  setDataChanged={setDataChanged} setList={textData} uid={uid} userEmail={email}/>
            {/* 記事列表顯示 */}
            {textData.length>0
            ?   
                <NoteList setIsArchive={setIsArchive} isDataChange={isDataChange} setDataChanged={setDataChanged} setList={textData} addData={setTextData} deleteData={setTextData} updateData={setTextData} uid={uid} userEmail={email}/>
            :<>            
                {isLoading
                ?<Loading />
                :null}
                <InitialDiv>
                    <InitialImg></InitialImg>
                    <InitialText>你新增的記事會顯示在這裡</InitialText>
                </InitialDiv>
            </>}
            </>}
                {/* 封存記事彈出視窗顯示 */}
                {isArchive.show?<ArchivePop id={isArchive.id}  uid={uid} setIsArchive={setIsArchive} setDataChanged={setDataChanged}/> :null}
                </NoteReducer>
        </NoteContent>
    )
}

export default NotePage