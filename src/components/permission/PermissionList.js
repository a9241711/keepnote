import styled from "styled-components";
import { User, PermissionClose } from "../../assets";
import { Text,IconDiv,Media_Query_SM, Media_Query_LG } from "../constant";


const PermissionUserDiv=styled.div`
    width:100%;
    display: flex;
    align-items: center;
    margin: 10px 0 5px;
`
const UserDiv=styled.div`
    width: 40px;
    height: 40px;
    background-color: transparent;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
`
const UserIcon=styled.div`
    width: 32px;
    height:32px;
    background-image: url(${User}) ;
    background-position: center;
    background-repeat: no-repeat;
`
const TextEmail=styled(Text)`
    margin-left: 10px;
    width: 90%;
    ${Media_Query_LG}{
        max-width: 430px;
    }
    ${Media_Query_SM}{
        width: 70%;
    }
 `
 const UserImg=styled.img`
    width:40px;
    height:40px;
    border-radius: 50%;
    border:1px solid #565656;
`
const PermissionCheckIcon=styled(IconDiv)`
    background-image: url(${PermissionClose}) ;
    cursor: pointer;
`
const PermissionList=({userEmail,id,setEmailList,profileUrl})=>{//Permission PopUp editing Area
     const handleClose=(e)=>{
        e.preventDefault();
        setEmailList(prev=> {
            return prev.filter(item=> item.email!==e.target.previousSibling.innerText);
         })
     }

    return(
        <PermissionUserDiv >
                <UserDiv >
                    {profileUrl!==null?<UserImg src={profileUrl}></UserImg>
                    :<UserIcon></UserIcon>}
                </UserDiv>
                <TextEmail>{userEmail}</TextEmail>
                <PermissionCheckIcon className="close" id={id} onClick={handleClose} ></PermissionCheckIcon>
        </PermissionUserDiv>
    )
 }

export default PermissionList




