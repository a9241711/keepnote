import { ListPopModifyBg } from "../../../components/constant";
import styled from "styled-components";
import { Text,Media_Query_LG,Media_Query_SMD,Media_Query_SM,LargerAnimate,CloseButton,Button } from "../../../components/constant";
import { deleteDbNote } from "../../../store/handledb/NoteDb";

const ArchiveDiv=styled.div`
    background-color: transparent;
    border: none;
    padding: 16px;
    position: fixed;
    width: 100%;
    max-width: 600px;
    top:20%;
    right: 0;
    left: 0;
    z-index: 4001;
    margin: 0 auto;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 8px;
    animation: ${LargerAnimate} 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    ${Media_Query_LG}{
      left:70px
    }
    ${Media_Query_SMD}{
      max-width: 400px;
    }
    ${Media_Query_SM}{
      max-width: 320px;
    }
`
const ArchiveEditDiv=styled.div`
    width:100%;
    height: auto;
    min-height: 195px;
    max-height: 500px;
    position: relative;
    padding:25px 15px 10px;
    box-sizing: border-box;
    box-shadow: 0 1px 2px 0 rgb(60 64 67/30%), 0 2px 6px 2px rgb(60 64 67 /15%);
    border-radius: 8px;
    background-color: #ffffff;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    ${Media_Query_SM}{
        width: 90%;
        max-height: 320px;
    }
`
const ButtonDiv=styled.div`
    width:100%;
    display:flex;
    justify-content: flex-end;
`
const ArchiveTitle=styled(Text)`
    font-size: 22px;
    margin-bottom: 20px;
`
const ArchiveText=styled(Text)`
    font-size: 16px;
    margin-bottom: 20px;
`
const ArchivePopDelete=({id,uid,setDataChanged,setAlertText,setAlert,alertText})=>{//確認刪除的彈出視窗
    const handleDelete=async()=>{
        await deleteDbNote(id,uid);
        setDataChanged(true);
      }
    const handleCancel=()=>{
        setAlert(false);
        setAlertText("");
      }
    return(
        <>
        <ListPopModifyBg />
        <ArchiveDiv>
          <ArchiveEditDiv>
            <ArchiveTitle>要刪除一則記事嗎？</ArchiveTitle>
            <ArchiveText>{alertText}</ArchiveText>
            <ButtonDiv>
              <CloseButton onClick={()=>handleCancel()}>
                取消
              </CloseButton>
              <Button onClick={()=>handleDelete()}>
                刪除
              </Button>
            </ButtonDiv>
          </ArchiveEditDiv>
        </ArchiveDiv>
        </>
    )
}

export default ArchivePopDelete

