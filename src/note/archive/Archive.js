import { useEffect, useState,useContext } from "react";
import styled from "styled-components";
import ArchiveItem from "./ArchiveItem";
import { getAllArchiveLists } from "../../store/HandleDb";
import Masonry from 'react-masonry-css';
import { ArchiveTool } from "../components/NoteTool";
import HeaderDiv,{HeaderArchiveDiv} from "../../header/Header";
import { Media_Query_LG,Media_Query_MD,Media_Query_SMD,Media_Query_SM } from "../../components/constant";
import HeaderLoadContext from "../../header/HeaderLoadContext";
import { ArchiveBgColor } from "../components/color/NoteBgColor";
import NavSideBar from "../../header/components/NavSideBar";
import { ArchiveBg } from "../../assets";

const ArchiveContent=styled.div`
    max-width:1200px;
    width: 100%;
    display:flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 45px;
    margin: 0 auto;
    ${Media_Query_LG}{
        padding-left: 80px;
    }
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
const ArchiveListsDiv=styled(Masonry)`
    width: 100%;
    &.my-masonry-grid{  
    display: flex;
    margin: 80px auto;
    box-sizing: border-box;
    justify-content: flex-start;
    }            
    &.my-masonry-grid >.my-masonry-grid_column{
    margin: 0 10px;

}       
`
const ArchiveIconDiv=styled.div`//Tool Div
    width: 100%;
    display:flex;
    align-items: center;
    justify-content: flex-start;
    opacity:0;
    visibility:"hidden";
    transition:visibility 0.3s linear,opacity 0.3s linear;
    position:relative;
    padding: 10px;
    box-sizing: border-box;
    ${Media_Query_MD}{
        width: 100%;
        opacity:1;
        visibility:"visible";
    }
    ${Media_Query_SMD}{
        width:100%;
        opacity:1;
        visibility:"visible";
    }
    ${Media_Query_SM}{
        width: 100%;
        opacity:1;
        visibility:"visible";
    }
`
const ArchiveLists=styled.div`//
    width: 250px;
    box-sizing: border-box;
    height:auto;
    margin: 10px 0;
    transition: all ease-in 0.2s;
    position: relative;
    border-radius: 8px;
    border: 1px solid #e0e0e0;
    ${Media_Query_MD}{
        width: 100%;
    }
    ${Media_Query_SMD}{
        width:100%;
    }
    ${Media_Query_SM}{
        width: 100%;
    }
    ${Media_Query_LG}{
        &:hover{
        transition: all ease-in-out .3s ;
        box-shadow: 0 1px 2px 0 rgb(60 64 67/50%), 0 2px 6px 2px rgb(60 64 67 /30%);
        }
        &:hover ${ArchiveIconDiv}{
            opacity:1;
            visibility:"visible";
        }
    }
    &:active ${ArchiveIconDiv}{
        visibility: hidden;
        
    }
`

const InitialDiv=styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 20vh;
`
const InitialImg=styled.div`
    background-size: 64px 64px;
    height: 64px;
    width: 64px;
    margin: 20px;
    opacity: .3;
    background-image: url(${ArchiveBg});
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

const Archive=()=>{
    const isLoggin=JSON.parse(localStorage.getItem("token"));
    const uid=isLoggin["uid"];
    const[archiveLists,setArchiveLists]=useState([]);
    const[isDataChange,setDataChanged]=useState(false);
    const{setIsLoading,isRefresh,setIsRefresh}=useContext(HeaderLoadContext);
    const breakPoints={//Masonry排版
        default:4,
        1023:3,
        768:2,
    }
    useEffect(()=>{//獲取資訊
        setIsLoading(true);
        async function handleAllArchiveLists(){
            await getAllArchiveLists(setArchiveLists,uid);
            setIsLoading(false);
        }
        handleAllArchiveLists();
        setDataChanged(false);
        setIsRefresh(false);
    },[isDataChange,isRefresh])//若資料更新或使用者點Refreh則須更新畫面
    return(
        <>        
        <HeaderDiv   isLoggin={isLoggin}/>
        <ArchiveContent>
        <NavSideBar />
        {archiveLists.length>0? 
        <ArchiveListsDiv breakpointCols={breakPoints} className="my-masonry-grid" columnClassName="my-masonry-grid_column">

        <>
            {archiveLists.map((item)=>{
                 const{id,noteText,noteTitle,image,time,color,whenToNotify=""}=item;
                 return(
                    <ArchiveLists key={id}>
                    <ArchiveBgColor id={id}  color={color}/>
                    <ArchiveItem  id={id} noteText={noteText}noteTitle={noteTitle}image={image}time={time}color={color}whenToNotify={whenToNotify}/>
                    <ArchiveIconDiv >
                    <ArchiveTool  id={id} uid={uid} setDataChanged={setDataChanged} />
                    </ArchiveIconDiv>
                    </ArchiveLists>
                 )

            })}
        </>

        </ArchiveListsDiv>
        :
        <InitialDiv>
        <InitialImg></InitialImg>
        <InitialText>你封存的記事會顯示在這裡</InitialText>
        </InitialDiv>}
        </ArchiveContent>
        </>
    )
}

export default Archive