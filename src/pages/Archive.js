import styled from "styled-components";
import { GlobalStyle,Media_Query_LG,Media_Query_MD,Media_Query_SMD,Media_Query_SM } from "../components/constant";
import NavSideBar from "../header/components/NavSideBar";
import { HeaderArchiveDiv } from "../header/Header";
import ArchiveIndex from "../note/archive";

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
const Archive=()=>{
    const isLoggin=JSON.parse(localStorage.getItem("token"));

    return(
        <>
        <GlobalStyle/>
        <HeaderArchiveDiv  isLoggin={isLoggin}/>
        <ArchiveContent>
            <NavSideBar />
            <ArchiveIndex />
        </ArchiveContent>
        </>

    )

}

export default Archive