import styled from "styled-components";
import { User, PermissionClose } from "../../assets";
import { Text,IconDiv,Media_Query_SM } from "../constant";


const PermissionUserDiv=styled.div`
    width:100%;
    display: flex;
    align-items: center;
    margin: 10px 0 5px;
`
const UserDiv=styled.div`
    width: 40px;
    height: 40px;
    background-color: #C6DAFC;
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
    ${Media_Query_SM}{
        width: 70%;
    }
 `
const PermissionCheckIcon=styled(IconDiv)`
    background-image: url(${PermissionClose}) ;
    cursor: pointer;
`
const PermissionList=({userEmail,id,setEmailList})=>{//Permission PopUp editing Area
     
     const handleClose=(e)=>{
        console.log(e.target.classList.contains("close"));
        e.preventDefault();
        setEmailList(prev=> {
            return prev.filter(item=> item!==e.target.previousSibling.innerText)
         })
     }

    return(
        <PermissionUserDiv >
                <UserDiv >
                    <UserIcon></UserIcon>
                </UserDiv>
                <TextEmail>{userEmail}</TextEmail>
                <PermissionCheckIcon className="close" id={id} onClick={handleClose} ></PermissionCheckIcon>
        </PermissionUserDiv>
    )
 }

export default PermissionList

