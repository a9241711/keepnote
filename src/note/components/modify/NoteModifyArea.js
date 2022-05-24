import { Link } from "react-router-dom";
import styled from "styled-components";
import NoteInput from "../NoteInput";
import NotificationDelete, { NotificationPopUpDelete,NotificationDeleteEdit } from "../notification/NotificationDelete";
import NoteColor, { NoteColorElement, NoteColorPop,NoteColorPopMb } from "../color/NoteColor";
import  { NotificationEdit, NotificationElement,NotificationEditMb } from "../notification/NotificationIndex";
import NoteModiBtn,{NoteModiEditBtnMb} from "./NoteModiBtn";
import { useContext, useEffect,useState } from "react";
import NoteContext from "../../context/NoteContext";
import { LargerAnimate,IconDiv,IconTipText,Media_Query_MD, Media_Query_SM,Media_Query_SMD,NoteTitleInput,NoteTextInput } from "../../../components/constant";
import { EditBoard,DeleteCheck,Plus } from "../../../assets";
import { updateNoteData,deleteBoard,queryImageData,saveNoteData } from "../../../store/HandleDb";
import { v4 } from "uuid";


const NoteListModifyBg = styled.div`//修改文字的Fixed背景顏色，觸控版關閉
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(121, 122, 124, 0.6);
  z-index: 999;
  ${Media_Query_SMD}{
    display: none;
  }
  ${Media_Query_SM}{
    display: none;
  }
`;
const NoteListModifyDiv=styled.div`
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
    ${Media_Query_SMD}{
      padding: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
    ${Media_Query_SM}{
      padding: 0;
      top: 0;
      width: 100%;
      height: 100%;
    }
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
        ${Media_Query_SMD}{
        display: none; 
        }
        ${Media_Query_SM}{
        display: none; 
        }
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
    //set up media query
    ${Media_Query_MD}{
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      min-height: unset;
      max-height: unset;
      padding:unset;
      border-radius:unset;
    }
    ${Media_Query_SMD}{
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      min-height: unset;
      max-height: unset;
      padding:unset;
      border-radius:unset;
    }
    ${Media_Query_SM}{
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      min-height: unset;
      max-height: unset;
      padding:unset;
      border-radius:unset;
    }
`
const NodeToolDiv=styled.div`//彈出框的tool div，手機版fixed在底部
    display: flex;
    max-width: 600px;
    width: 100%;
    justify-content: space-between;
    padding:0 10px;
    position: relative;
    bottom: 20px;
    box-sizing: border-box;
    box-shadow: 0px -1px 8px -1px rgba(0,0,0,0.23);
    border-radius: 8px;
        //set up media query
        ${Media_Query_MD}{
        border-radius:unset;
        bottom: 0;
        max-width:unset;
      }
        ${Media_Query_SMD}{
        border-radius:unset;
        bottom: 0;
        max-width:unset;
      }
        ${Media_Query_SM}{
        border-radius:unset;
        bottom: 0;
      }
`
const BoardAdd=styled(IconDiv)` //新增畫板的Icon
    background-repeat: no-repeat;
    background-position: center;
    background-image: url(${EditBoard}) ;
`
const BoardList=styled.div` //board img的大DIV
    width:100%;
    background:#f9f6f6;
    position: relative;
    opacity: ${props=>props.image?1:0};
    visibility: ${props=>props.image?"visible":"hidden"};
    transition:visibility 0.3s linear,opacity 0.3s linear;
    ${Media_Query_SM}{
    margin-top: 50px;
    }
`
const BoardDiv=styled.div` //board img的小DIV
    height: 500px;
    ${Media_Query_SM}{
    height: 400px;
    }
`
const BoardImg=styled.img`//board img
    height:100%;
    pointer-events:none;
`
const DeleteIcon=styled(IconDiv)`//img刪除按鈕
  background-image: url(${DeleteCheck}) ;
  cursor: pointer;
  position: absolute;
  bottom: 0;
  right: 5%;
`

const NoteModifyArea =({uid,setSelected,selected,setDataChanged,isDataChange})=>{//PopUp Update 視窗
    const[clickNotificate,setClickNotificate]=useState(false);//是否點擊NotificationIcon;
    const[clickColor,setClickColor]=useState(false);
    const[notificationChange,setNotificationChange]=useState(false);//是否更新NotificationIcon;
    const[image,setImage]=useState("");
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
       handleImgeQuery();
    },[isDataChange])

    return(
      <>
        <NoteListModifyBg>
        </NoteListModifyBg>
        <NoteListModifyDiv>
            <NoteListModify  style={{background:updateColor}}  id={id}     >
              { image ?
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
                : null }
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
              {clickColor? <NoteColorPop setClickColor={setClickColor} id={id} uid={uid} clickColor={clickColor} setDataChanged={setDataChanged}/> :null}
              </NodeToolDiv>
              
        </NoteListModifyDiv> 
           </>    
    )

}
export default NoteModifyArea;

//For Edit Mobile
const NoteListEditDiv=styled.div`
    background-color: transparent;
    border: none;
    padding: 0;
    position: fixed;
    width: fit-content;
    width: 100%;
    height: 100%;
    top:0;
    right: 0;
    left: 0;
    z-index: 4001;
    display: none;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
    animation: ${LargerAnimate} 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    ${Media_Query_MD}{
    display: flex;
    }
    ${Media_Query_SMD}{
    display: flex;
    }
    ${Media_Query_SM}{
      display: flex;
    }
`
const NoteListEditBm=styled.div`
      width: 100%;
      height: 45px;
      position: fixed;
      left: 0;
      background: #ebebeb;
      bottom: 0;
      display: none;
      justify-content: center;
      z-index: 3500;
    ${Media_Query_MD}{
    display: flex;
    }
    ${Media_Query_SMD}{
    display: flex;
    }
    ${Media_Query_SM}{
      display: flex;
    }
`
const NoteEditAddDiv=styled.div`
    width: 50px;
    height: 50px;
    transform: translateY(-35px);
    display: none;
    background: #f0f0f0f7;
    border-radius: 15px 15px;
    align-items: center;
    border: 2;
    border: 5px solid #FFFFFF;
    justify-content: center;
    ${Media_Query_MD}{
    display: flex;
    }
    ${Media_Query_SMD}{
    display: flex;
    }
    ${Media_Query_SM}{
      display: flex;
    }
`
const NoteEditAdd=styled(IconDiv)`
    background-repeat: no-repeat;
    background-position: center;
    background-image: url(${Plus}) ;

`
const NoteTitleInputDiv=styled(NoteTitleInput)`
    height: 22px;
    line-height: 22px;

`
const NoteTextInputDiv=styled(NoteTextInput)`
    height: 22px;
    line-height: 22px;

`

export const NoteModifyAreaMb =({uid,setDataChanged})=>{
  const[noteTitle,setNoteTitle]=useState("");
  const[noteText,setNoteText]=useState("");
  const[noteColor,setNoteColor]=useState("#FFFFFF");
  const[notification,setNotification]=useState(1);
  const[clickNotificate,setClickNotificate]=useState(false);//是否點擊NotificationIcon;
  const[clickColor,setClickColor]=useState(false);//是否點擊ColorIcon
  const[isClickEdit,setIsClickEdit]=useState(false);//是否點擊Add新增
  const[isClose,setIsClose]=useState(false);//檢查是否按關閉
  const id =v4();
  //auto height 輸入框
    //控制修改文字框的height
    const handleAutoHeight=(e)=>{
      e.target.style.height=e.target.scrollHeight + "px"
    }

    const getNodeTitleValue=(e)=>{
        setNoteTitle(e.currentTarget.value);
        handleAutoHeight(e);
    }

    const getNodeTextValue=(e)=>{
        setNoteText(e.currentTarget.value);
        handleAutoHeight(e);
    }
  const handleSaveNoteToDb=async ()=>{
    if(notification!==1){
        const{timer,currentToken}=notification;
        await saveNoteData(id,noteTitle,noteText,uid,noteColor,timer,currentToken);
        setDataChanged(true);
        setIsClose(true);
        setIsClickEdit(false);
      }

    else{
      const timer=1; 
      const currentToken=1;
      await saveNoteData(id,noteTitle,noteText,uid,noteColor,timer,currentToken);
      setDataChanged(true);
      setIsClose(true);
      setIsClickEdit(false);
    }
  }
  useEffect(()=>{//是否按下關閉，是則清空內容
      if(!isClose)return 
      setNoteTitle("");
      setNoteText("");
      setNoteColor("#FFFFFF");
      setNotification(1);
      setIsClose(false);
    },[isClose])
  return(
    <>
    {isClickEdit?
    <>
      <NoteListEditDiv>
          <NoteListModify  style={{background:noteColor}}  id={id}     >
          <NoteTitleInputDiv style={{backgroundColor: noteColor}} value={noteTitle} onChange={getNodeTitleValue}  ></NoteTitleInputDiv>
          <NoteTextInputDiv style={{backgroundColor: noteColor}}  value={noteText} onChange={getNodeTextValue}  ></NoteTextInputDiv>
          <NotificationDeleteEdit   notification={notification} setNotification={setNotification} />
          </NoteListModify>
          <NodeToolDiv style={{background:noteColor}}>
            <Link  to={"/boarding"} state={{id:id,uid}}>
            <BoardAdd  onClick={handleSaveNoteToDb}></BoardAdd>
            </Link>
            <NotificationElement   setClickNotificate={setClickNotificate}/>
            <NoteColorElement setClickColor={setClickColor} />
            <NoteModiEditBtnMb setIsClickEdit={setIsClickEdit} handleSaveNoteToDb={handleSaveNoteToDb} setIsClose={setIsClose}/>
            {clickNotificate?<NotificationEditMb setClickNotificate={setClickNotificate} setNotification={setNotification}/> :null}    
            {clickColor? <NoteColorPopMb  setClickColor={setClickColor} setNoteColor={setNoteColor}/>:null}
            </NodeToolDiv>
      </NoteListEditDiv> 
    </>
    :<NoteListEditBm>
      <NoteEditAddDiv>
      <NoteEditAdd onClick={()=>setIsClickEdit(true)}></NoteEditAdd>
      </NoteEditAddDiv>
    </NoteListEditBm>
        }
    </>
  )

}
