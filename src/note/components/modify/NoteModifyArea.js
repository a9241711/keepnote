import { Link } from "react-router-dom";
import styled from "styled-components";
import NoteInput from "../NoteInput";
import NotificationDelete, { NotificationPopUpDelete } from "../notification/NotificationDelete";
import NoteColor, { NoteColorElement, NoteColorPop } from "../color/NoteColor";
import NotificationIndex, { NotificationEdit, NotificationElement } from "../notification/NotificationIndex";
import NoteModiBtn from "./NoteModiBtn";
import { useContext, useEffect } from "react";
import NoteContext from "../../context/NoteContext";
import { LargerAnimate,IconDiv,IconTipText } from "../../../components/constant";
import { EditBoard,DeleteCheck } from "../../../assets";
import { useState } from "react";
import { updateNoteData,deleteBoard,queryImageData } from "../../../store/HandleDb";
import HeaderLoadContext from "../../../header/HeaderLoadContext";

const NoteListModifyDiv = styled.div`//修改文字的Fixed背景
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(121, 122, 124, 0.6);
  z-index: 999;
`;
const NoteListModifyBg=styled.div`
    background-color: transparent;
    border: none;
    padding: 16px;
    position: fixed;
    width: fit-content;
    top:20%;
    right: 0;
    left: 0;
    z-index: 4001;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    animation: ${LargerAnimate} 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
`
const NoteListModify = styled.div`//修改內容的Div
  width: 600px;
  height: auto;
  min-height: 195px;
  max-height: 450px;
  position: relative;
  padding:10px 10px 30px 10px;
  box-sizing: border-box;
  box-shadow: 0 1px 2px 0 rgb(60 64 67/30%), 0 2px 6px 2px rgb(60 64 67 /15%);
  border-radius: 8px;
  background-color: #ffffff;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
        width: 12px;
    }
    &::-webkit-scrollbar-button {
    height: 0;}
    &::-webkit-scrollbar-track {
        background: transparent; 
        border: 0;
    }
    &::-webkit-scrollbar-thumb {
        border-width: 1px 1px 1px 2px;
        background-color: rgba(0,0,0,.2);
        background-clip: padding-box;
        border: solid transparent;
        box-shadow: inset 1px 1px 0 rgb(0 0 0 / 10%), inset 0 -1px 0 rgb(0 0 0 / 7%);
    }
    &::-webkit-scrollbar-corner {
    background: transparent}
    /* Handle on hover */
    &::-webkit-scrollbar-thumb:hover {
        border-width: 1px 1px 1px 2px;
        background-color: rgba(0,0,0,.4);
        background-clip: padding-box;
        border: solid transparent;
        }
`
const NodeToolDiv=styled.div`//彈出框的tool div
  display: flex;
  max-width: 600px;
  width: 100%;
  justify-content: space-around;
  padding:0 10px;
  position: relative;
  bottom: 20px;
  box-sizing: border-box;
  box-shadow: 0px -1px 8px -1px rgba(0,0,0,0.23);
  border-radius: 8px;
`
const BoardAdd=styled(IconDiv)` //新增畫板的Icon
  background-repeat: no-repeat;
  background-position: center;
  background-image: url(${EditBoard}) ;
`
const BoardList=styled.div` //board img的DIV
    width:100%;
    background:#f9f6f6;
    position: relative;
    opacity: ${props=>props.image?1:0};
    visibility: ${props=>props.image?"visible":"hidden"};
    transition:visibility 0.3s linear,opacity 0.3s linear;

`
const BoardDiv=styled.div`
    width: 100%;
`
const BoardImg=styled.img`//board img
    width:100%;
    pointer-events:none;

`
const DeleteIcon=styled(IconDiv)`
  background-image: url(${DeleteCheck}) ;
  cursor: pointer;
  position: absolute;
  bottom: 0;
  right: 5%;
`

const NoteModifyArea =({uid,setSelected,selected,setDataChanged,isDataChange})=>{
    const[clickNotificate,setClickNotificate]=useState(false);//是否點擊NotificationIcon;
    const[clickColor,setClickColor]=useState(false);
    const[notificationChange,setNotificationChange]=useState(false);//是否更新NotificationIcon;
    const[image,setImage]=useState("");
    const{isLoading,setIsLoading}=useContext(HeaderLoadContext);
    const {selectedItem,updateColor,updateTitle,updateText,updateNotification} =useContext(NoteContext);
    const{id, noteText, noteTitle, index,time,color,board=null}=selectedItem;
    
    const handleUpdateSubmmit =async  () => {
      const { id } = selectedItem;
      const updateTextElements = {
        id,
        noteTitle: updateTitle,
        noteText: updateText,
        color:updateColor
      };
      await updateNoteData(id, updateTextElements,uid);
      setSelected(false);
    };

    const handleDeleteImg=async()=>{
      const { id } = selectedItem;
      await deleteBoard(id,uid);
      setDataChanged(true);
    }

    useEffect(()=>{
      async function handleImgeQuery(){
        const { id } = selectedItem;
       const res=await queryImageData(id,uid);
       if(!res.error){setImage(res["image"])}
       else{setImage("") }
      }
      setIsLoading(true);
      handleImgeQuery();
      setTimeout(()=>setIsLoading(false),1000); 
    },[isDataChange])

    return(
      <>
        <NoteListModifyDiv>
        </NoteListModifyDiv>
        <NoteListModifyBg>
            <NoteListModify  style={{background:updateColor}}  id={id}     >
              {/* { image ? */}
              <BoardList image={image}>
              <Link  to={"/boarding"} state={{id:id,board:board,uid}}>
              <BoardDiv >
              <BoardImg onClick={() => handleUpdateSubmmit()} src={image}></BoardImg>
              </BoardDiv>
              </Link>
              <DeleteIcon onClick={handleDeleteImg}>
              <IconTipText >刪除</IconTipText>
              </DeleteIcon>
              </BoardList>
                {/* : null } */}
              <NoteInput  />
              <NotificationPopUpDelete notificationChange={notificationChange} setNotificationChange={setNotificationChange}  setDataChanged={setDataChanged} selected={selected}  uid={uid} />
            </NoteListModify>
            <NodeToolDiv style={{background:updateColor}}>
              { image ? null
              :<Link  to={"/boarding"} state={{id:id,board:board,uid}}>
              <BoardAdd onClick={() => handleUpdateSubmmit()} ><IconTipText>新增畫板</IconTipText></BoardAdd>
              </Link>}
              <NotificationElement  clickNotificate={clickNotificate} setClickNotificate={setClickNotificate}/>
              <NoteColorElement  setClickColor={setClickColor} clickColor={clickColor}/>
              <NoteModiBtn uid={uid} setSelected={setSelected} setDataChanged={setDataChanged}/>
              {clickNotificate?<NotificationEdit setClickNotificate={setClickNotificate} setNotificationChange={setNotificationChange} uid={uid} selected={selected} setDataChanged={setDataChanged}/> :null}    
              {clickColor? <NoteColorPop id={id} uid={uid} clickColor={clickColor} setClickColor={setClickColor} setDataChanged={setDataChanged}/> :null}
              </NodeToolDiv>
              
        </NoteListModifyBg> 
           </>    
 
                // : null}
    )

}

export default NoteModifyArea