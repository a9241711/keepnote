import styled from "styled-components"
import { Text,Button,IconDiv,IconTipText,bounceInLeft,LargerAnimate } from "../../../components/constant";
import { Close } from "../../../assets";
import { Link } from "react-router-dom";
import NoteInput from "../NoteInput";
import NoteColor from "../color/NoteColor";
import NoteMotiBtn from "../modify/NoteModiBtn";
import { useContext } from "react";
import NoteContext from "../../context/NoteContext";

const NotificationFixed=styled.div`
    max-width: 512px;
    width: 100%;
    height:150px;
    position: fixed;
    z-index: 500;
    bottom: 10%;
    left:5%;
    visibility: visible;
    background-color: #323232;
    box-sizing:border-box;
    padding: 30px;
    border-radius: 3px;
    transition: all 0.218 ease-in-out;
    display: flex;
    justify-content: space-around;
    animation:${bounceInLeft} 1.1s both;
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
`
const NotifIconDiv=styled(IconDiv)`
    background-repeat: no-repeat;
    background-position: center;
    background-image: url(${Close}) ;
`       
const NotificationPop=({setIsNotification,popValue,setList,setSelected,})=>{
    const{title,body,time}=popValue;
    const {getSelectedItem,getColorUpdate,getNoteUpdateTitle,getNoteUpdateText}=useContext(NoteContext)
    const currentTime=new Date(parseInt(time)).toLocaleDateString()+" "  + new Date(parseInt(time)).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})

    const handlePopItem=()=>{
        const{id}=popValue;
        const notificationItem = setList.filter(item=>
            item.id === id 
        );
        const {  noteText, noteTitle, index,time,color,image }=notificationItem[0]
        console.log(notificationItem);
        // setUpdateText(noteText);
        // setUpdateTitle(noteTitle);
        // setPopUpColor(color);
        getColorUpdate(color);
        getNoteUpdateTitle(noteText);
        getNoteUpdateText(noteText);
        getSelectedItem(id, noteText, noteTitle, index,image,time,color); //找到陣列中的值
        setSelected(true); //找到陣列中的值
    }
    
    return(
        <>
        <NotificationFixed>
            <NotifDiv>
            <NotifText>{currentTime} - {title} - {body}</NotifText>
            <NotifBtn onClick={handlePopItem}>開啟記事</NotifBtn>
            <NotifIconDiv onClick={()=>setIsNotification(false)}><IconTipText>關閉</IconTipText></NotifIconDiv>
            </NotifDiv>
        </NotificationFixed>
    
        </>
    )

}

export default NotificationPop