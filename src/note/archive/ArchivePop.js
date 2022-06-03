import styled from "styled-components"
import { Close } from "../../assets";
import { Media_Query_SM,Media_Query_SMD,Text,Button,IconDiv,IconTipText,bounceInLeft, } from "../../components/constant";
import { updateNoteStatusBack } from "../../store/HandleDb";

const NotificationFixed=styled.div`
    max-width: 512px;
    width: 100%;
    height:100px;
    position: fixed;
    z-index: 500;
    bottom: 10%;
    left:5%;
    visibility: visible;
    background-color: #323232;
    box-sizing:border-box;
    padding: 30px;
    border-radius: 8px;
    transition: all 0.218 ease-in-out;
    display: flex;
    justify-content: space-around;
    animation:${bounceInLeft} 1.1s both;
    ${Media_Query_SMD}{
        max-width: 320px;
    }
    ${Media_Query_SM}{
        max-width: 280px;
    }
`
const NotifDiv=styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    word-break: break-word;
    min-height: 28px;
    text-overflow: ellipsis;
    overflow:hidden;
`
const NotifText=styled(Text)`
    width: 330px;
    color: #FFFFFF;
    text-overflow: ellipsis;
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 4;
    line-height: 1.5rem;

`
const NotifBtn=styled(Button)`
    color: #fb0;
    margin-left: 5px;
    white-space: nowrap;
    height: auto;
    padding: 8px 24px;
    border-radius: 4px;
    ${Media_Query_SMD}{
        background-color: transparent;
    }
    ${Media_Query_SM}{
        background-color: transparent;
    }
`
const NotifIconDiv=styled(IconDiv)`
    background-repeat: no-repeat;
    background-position: center;
    background-image: url(${Close}) ;
    cursor: pointer;
`       


const ArchivePop=({id,uid,setIsArchive,setDataChanged})=>{//Archive彈出視窗

    const updateItem = async () => {//恢復封存狀態
        console.log("id",id,"uid",uid)
        await updateNoteStatusBack(id,uid); 
        setDataChanged(true);
        setIsArchive({show:false,id:null})
      };
    return(
        <>
        <NotificationFixed>
            <NotifDiv>
            <NotifText>記事已封存</NotifText>
            <NotifBtn onClick={updateItem}>復原</NotifBtn>
            <NotifIconDiv onClick={()=>setIsArchive(false)}><IconTipText>關閉</IconTipText></NotifIconDiv>
            </NotifDiv>
        </NotificationFixed>
        </>
    )
}

export default ArchivePop