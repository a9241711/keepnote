import { Text } from "../../components/constant";
import styled from "styled-components";
import {ArchiveNotification} from "../components/notification/NotificationDelete";
import PermissionItem from "../../components/permission/PermissionItem";

const BoardList=styled.div` //board img的DIV
    width:100%;
    background:#f9f6f6;
`
const BoardImg=styled.img`//board img
    width:100%;
    pointer-events:none;
`

const NoteLists = styled.div`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    box-sizing: border-box;
    padding: 3px;
    transition: all ease-in-out .2s; 
    position: relative;
`;

const NoteDiv=styled.div`
    width: 100%;
    display:flex;
    justify-content: flex-start;
    flex-direction: column;
    padding: 0 10px;
    margin-bottom:  10px;
    margin-top: 10px;
    box-sizing: border-box;
`
const NoteTitle=styled(Text)`
    font-size: 16px;
    font-weight: 400;
    margin:5px 0;
`
const NoteText=styled(Text)`
    margin:5px 0;
`
const NoteNone=styled(Text)`
    font-size: 26px;
`
const NoteAttitionDiv=styled.div`
    padding: 0 10px;
`

const ArchiveItem=({uid,id,image,noteText,noteTitle,whenToNotify,permissionEmail,owner,targetEmail,userEmail})=>{

    return(
        <>
        <NoteLists  >
        { image ?
        <BoardList>
            <BoardImg src={image}></BoardImg>
        </BoardList>
        : null }
        <NoteDiv >  
        {!image && !noteTitle &&!noteText 
        ?<NoteNone>空白記事</NoteNone>
        :
        <>
        <NoteTitle >{noteTitle}</NoteTitle>
        <NoteText >{noteText}</NoteText>
        </>
          }
        </NoteDiv>
        </NoteLists>
        <NoteAttitionDiv>
            <PermissionItem permissionEmail={permissionEmail}owner={owner}targetEmail={targetEmail} userEmail={userEmail}/>
            <ArchiveNotification  whenToNotify={whenToNotify}   />
        </NoteAttitionDiv>
      </>
    )

}

export default ArchiveItem