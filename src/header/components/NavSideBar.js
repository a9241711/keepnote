import styled from "styled-components";
import { IconDiv,Text,Media_Query_SM, Media_Query_LG, Media_Query_SMD,Media_Query_MD } from "../../components/constant";
import { ArchiveImg,Bulb } from "../../assets";
import { Link } from "react-router-dom";
import { useContext } from "react";
import HeaderLoadContext from "../HeaderLoadContext";

const NavSideDiv=styled.div`
    background-color: #fff;
    display: flex;
    flex-direction: column;
    height:100%;
    overflow: hidden;
    position: fixed;
    top: 65px;
    left: 0;
    margin-bottom: 65px;
    align-items: flex-start;
    transition-duration: 150ms;
    transition-property: width,box-shadow,border-radius;
    transition-timing-function: cubic-bezier(0.4,0,0.2,1);
    z-index: 12;
    ${Media_Query_LG}{
        width:  ${(props)=> {return props.navClick? "280px":"70px"}};
        box-shadow:${(props)=> {return props.navClick? "6px 1px 14px -1px rgba(86,86,86,0.43)":"unset"}};
    }
    ${Media_Query_MD}{
        width:  ${(props)=> {return props.navClick? "30%":"0px"}};
        box-shadow:6px 1px 14px -1px rgba(86,86,86,0.43);
    }
    ${Media_Query_SMD}{
        width:  ${(props)=> {return props.navClick? "40%":"0px"}};
        box-shadow:6px 1px 14px -1px rgba(86,86,86,0.43);
    }
    ${Media_Query_SM}{
        width:  ${(props)=> {return props.navClick? "50%":"0px"}};
        box-shadow:6px 1px 14px -1px rgba(86,86,86,0.43);
    }
    &:hover{
        width: 280px;
        box-shadow: 6px 1px 14px -1px rgba(86,86,86,0.43);
    }
`

const NavHomePageDiv=styled.div.attrs(props=>({
    className:props.home?"active":null
}))` 
    &:hover.active {
        width: 260px;
        border-radius: 0 50px 50px  0;
        background-color: #FEEFC3;
        padding-left: -10px;
    }
    display:flex;
    width: 100%;
    height: 48px;
    align-items: center;
    padding-left: 7px;
    &:hover{
        width: 260px;
        background-color:rgba(95,99,104,0.157);
        border-radius: 0 50px 50px  0;
    }
`
const NavArchivePageDiv=styled(NavHomePageDiv).attrs(props=>({
    className:props.archive?"active":null
}))`
    

`

const NavPageIcon=styled(IconDiv).attrs(props=>({
    className:props.home?"active":null
}))`    
    &.active {
    background-color: #FEEFC3;
    border-radius: 50%;
    }
    width: 32px;
    height: 32px;
    cursor: pointer;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url(${Bulb}) ;
    background-color: transparent;
    margin-right: 50px;
    

`
const NavPageIconText=styled(Text)`
    height: 48px;
    line-height: 48px;
`
const ArchivePageIcon=styled(NavPageIcon).attrs(props=>({
    className:props.archive?"active":null
}))`
    background-image: url(${ArchiveImg}) ;
`

const NavSideBar=()=>{
    const {navClick,page,getHome,getArchive,getNavClick} =useContext(HeaderLoadContext);
    const{home,archive}=page;
    const handleClickHome=()=>{
        getHome();
        getNavClick();
    }
    const handleClickArchive=()=>{
        getArchive();
        getNavClick();
    }
 
    return(
        <NavSideDiv navClick={navClick} >
            <Link to={"/"} style={{ textDecoration: 'none' }} onClick={handleClickHome}>
            <NavHomePageDiv home={home}>
            <NavPageIcon home={home}></NavPageIcon>
            <NavPageIconText>記事</NavPageIconText>
            </NavHomePageDiv>
            </Link>
            <Link to={"/archive"} style={{ textDecoration: 'none' }} onClick={handleClickArchive}>
            <NavArchivePageDiv archive={archive}>
            <ArchivePageIcon archive={archive}> </ArchivePageIcon>
            <NavPageIconText>封存</NavPageIconText>
            </NavArchivePageDiv>
            </Link>
        </NavSideDiv>
    )
}

export default NavSideBar