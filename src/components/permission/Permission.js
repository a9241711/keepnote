
import { useEffect, useState,useContext } from "react";
import styled from "styled-components";
import { v4 } from "uuid";
import { AddUser } from "../../assets";
import { IconDiv,IconTipText,Media_Query_SM,Media_Query_SMD,LargerAnimate,Button,CloseButton,Text, Media_Query_MD, Media_Query_LG, ListPopModifyBg } from "../constant";
import {UserEdit, UserPermission} from "../../header/User";
import PermissionEdit from "./PermissionEdit"
import PermissionList from "./PermissionList";
import NoteContext from "../../note/context/NoteContext";
import { queryForEmail, queryUserImgByEmail } from "../../store/handledb/MemberDb";
import { savePermission } from "../../store/handledb/PermmisionDb";


const PermissionIcon=styled(IconDiv)`
    background-image: url(${AddUser}) ;
    cursor: pointer;
`
const PermissionDiv=styled.div`
    background-color: transparent;
    border: none;
    padding: 16px;
    position: fixed;
    width: 100%;
    max-width: 610px;
    top:20%;
    right: 0;
    left: 70px;
    z-index: 4001;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    flex-direction: column;
    animation: ${LargerAnimate} 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both;
    ${Media_Query_SM}{
        /* max-width: 320px; */
        padding:0;
        left: 0;
    }
    ${Media_Query_SMD}{
        left: 0;
        padding: 0;
    }
    ${Media_Query_MD}{
        left: 0;
    }
`
const PermissionEditDiv=styled.div`
    width:100%;
    height: auto;
    min-height: 195px;
    max-height: 500px;
    position: relative;
    padding:25px 15px 10px;
    box-sizing: border-box;
    box-shadow: 0 1px 2px 0 rgb(60 64 67/30%), 0 2px 6px 2px rgb(60 64 67 /15%);
    border-radius: 8px 8px 0 0;
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
const PermissionTitleDiv=styled.div`
    width: 100%;
    /* padding: 25px 10px; */
    border-bottom: 1px solid #CCCCCC;
    box-sizing: border-box;
`
const PermissionTitleText=styled(Text)`
    font-size: 18px;
    font-weight: 500;
    height: 25px;
    padding: 0 0 10px 0;
`

const PermissionUserDiv=styled.div`
    width:100%;
    display: flex;
    align-items: center;
    margin: 10px 0 5px;
`
const PermissionInputDiv=styled.div`
    width:100%;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

const PermissionBtnDiv=styled.div`
    width:100%;
    display:flex;
    align-items:center ;
    justify-content: flex-end;
    background-Color:#EDEDED;
    padding: 10px 15px;
    position: relative;
    overflow: hidden;
    border-radius: 0 0 8px 8px;
    box-sizing:border-box;
    box-shadow: 0 1px 2px 0 rgb(60 64 67 / 30%), 0 2px 6px 2px rgb(60 64 67 / 15%);
    ${Media_Query_SM}{
        width: 90%;
        max-height: 320px;
    }
`
const TextEmail=styled(Text)`
    margin-left: 10px;
 `

const PermissionBtn=styled(Button)`
    pointer-events: ${props=>{return props.loading==="true"?"none":"auto"}};
`
const PermissionClose=styled(CloseButton)`
`
const EmailErrorText=styled(Text)`
    color: #d93025;
    font-size: 13px;
    font-style: italic;
    margin-left:50px;
`

const Permission=({uid,id,userEmail,permissionEmail,owner,targetEmail,setDataChanged})=>{//for List 
    const[emailList,setEmailList]=useState();
    const[emailError,setEmailError]=useState([]);//處理從db來的錯誤訊息顯示
    const[emailErrorMes,setEmailErrorMes]=useState();//處理信箱格式檢查的錯誤顯示
    const[clickPermission,setClickPermission]=useState(false);
    const[isModify,setIsModify]=useState(false);
    const[loading, setLoading] = useState(false);//防止使用者重複點擊
    const handleSummit=async()=>{
        setLoading(true);
        const res=await savePermission(uid,id,emailList);
        const getRes=res.filter(item=> item.error);
        setEmailError( [...getRes]);
        setLoading(false);
        if(getRes.length>0) return//若有錯誤訊息返回，不設定setIsModify
        setDataChanged(true);
        setIsModify(true);
    }
    useEffect(()=>{
        const handleEmailList=async()=>{
            if(owner===true){
                const permissionEmailCopy=permissionEmail.slice(0);
                permissionEmailCopy.unshift(userEmail);
                const noRepeatValue=[...(new Set(permissionEmailCopy))];
                await queryUserImgByEmail(noRepeatValue,setEmailList);
            }else{
                const permissionEmailCopy=permissionEmail.slice(0);
                permissionEmailCopy.unshift(targetEmail);
                const noRepeatValue=[...(new Set(permissionEmailCopy))];
                await queryUserImgByEmail(noRepeatValue,setEmailList);
            }
        }
        handleEmailList();
        //載入資料庫permission資料
    },[])
    useEffect(()=>{
        if(!isModify) return
        setDataChanged(false);
        setIsModify(false);
        window.location.reload();
    },[isModify])

    return (
        <>
        <PermissionIcon onClick={()=>  {setClickPermission(!clickPermission)} }><IconTipText>協作者</IconTipText></PermissionIcon>   
        {clickPermission? 
        <>
        <ListPopModifyBg />

        <PermissionDiv>
            <PermissionEditDiv>
                <PermissionTitleDiv>
                    <PermissionTitleText>協作者</PermissionTitleText>
                </PermissionTitleDiv> 
                {emailList.slice(0,1).map((item)=>{
                    const id=v4();
                    const{email,profileUrl}=item;
                    return(
                        <PermissionUserDiv key={id} >
                        <UserPermission   id={id} email={email} profileUrl={profileUrl} />
                        <TextEmail>{email} (擁有者)</TextEmail> 
                        </PermissionUserDiv>
                    )
                })}
                {emailList.slice(1).map((item)=>{
                    const id=v4();
                    const{email,profileUrl}=item;
                    return(
                        <PermissionList  key={id} id={id} userEmail={email} profileUrl={profileUrl} setEmailList={setEmailList} />
                    )
                })}
                <PermissionInputDiv>
                    <PermissionEdit  emailList={emailList} setEmailList={setEmailList} setEmailErrorMes={setEmailErrorMes} setEmailError={setEmailError}/>
                    <EmailErrorText >{emailErrorMes}</EmailErrorText>
                {emailError.length>0?
                <>
                    {emailError.map(error=> {
                    const id=v4();
                    return(
                    <EmailErrorText key={id}>{error.error}</EmailErrorText>
                        )
                     })
                    }
                </> 
                :null}
                </PermissionInputDiv>
            </PermissionEditDiv>
            <PermissionBtnDiv>
                    <PermissionClose onClick={()=>  setClickPermission(!clickPermission) }>取消</PermissionClose>
                    <PermissionBtn loading={loading.toString()} disabled={loading} onClick={handleSummit}>儲存</PermissionBtn>
            </PermissionBtnDiv>
        </PermissionDiv>
        </>
        :null}
        </>
    )
}

export default Permission

export const PermissionEditArea=({uid,userEmail,setEmailList,emailList})=>{//for Edit
    const[emailError,setEmailError]=useState([]);//處理從db來的錯誤訊息顯示
    const[emailErrorMes,setEmailErrorMes]=useState();//處理信箱格式檢查的錯誤顯示
    const[clickPermission,setClickPermission]=useState(false);
    const [loading, setLoading] = useState(false);//防止使用者重複點擊
    const handleSummit=async()=>{
        setLoading(true);
        const res=await queryForEmail(emailList);//query for email
        const getRes=res.filter(item=> item.error);
        if(getRes.length >0){
            setEmailError( [...getRes]);
            setLoading(false);
            return
        }else{
            setLoading(false);
            setClickPermission(false);
        }
    }
 
    return (
        <>
        <PermissionIcon onClick={()=>  {setClickPermission(!clickPermission)} }><IconTipText>協作者</IconTipText></PermissionIcon>   
        {clickPermission? 
        <>
        <ListPopModifyBg />

        <PermissionDiv>
            <PermissionEditDiv>
                <PermissionTitleDiv>
                    <PermissionTitleText>協作者</PermissionTitleText>
                </PermissionTitleDiv>
                <PermissionUserDiv>
                    <UserEdit email={userEmail}  uid={uid}/> 
                    <TextEmail>{userEmail} (擁有者)</TextEmail> 
                </PermissionUserDiv>
                {emailList.map((item)=>{
                        const id=v4();
                        const{email,profileUrl}=item;
                        return(
                            <PermissionList  key={id} id={id} userEmail={email} profileUrl={profileUrl} setEmailList={setEmailList} />
                        )
                })}
                <PermissionInputDiv>
                    <PermissionEdit  emailList={emailList} setEmailList={setEmailList} setEmailErrorMes={setEmailErrorMes} setEmailError={setEmailError}/>
                    <EmailErrorText >{emailErrorMes}</EmailErrorText>
                {emailError.length>0?
                <>
                    {emailError.map(error=> {
                    const id=v4();
                    return(
                    <EmailErrorText key={id}>{error.error}</EmailErrorText>
                        )
                    })
                    }
                </> 
                :null}
            </PermissionInputDiv>
            </PermissionEditDiv>
            <PermissionBtnDiv>
                        <PermissionClose onClick={()=>  setClickPermission(!clickPermission) }>取消</PermissionClose>
                        <PermissionBtn loading={loading.toString()} disabled={loading} onClick={handleSummit}>儲存</PermissionBtn>
            </PermissionBtnDiv>
        </PermissionDiv>
        </>
        :null}
        </>
    )
}


const PermissionModifyDiv=styled.div`
    background-color: #afafb0;
    border: none;
    border-radius: 8px;
    padding: 12px;
    position: fixed;
    width: 100%;
    /* max-width: 610px; */
    height: 100%;
    top:0;
    right: 0;
    left: 0;
    z-index: 5001;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: flex-start;
    ${Media_Query_LG}{
        padding: 0;
    }
    ${Media_Query_MD}{
        align-items: center;
    }
    ${Media_Query_SMD}{
        align-items: center;
        justify-content: center;
        padding: 0;
    }
    ${Media_Query_SM}{
        background-color: rgba(121,122,124,0.6);
        align-items: center;
        justify-content: center;
        height: 100%;
        padding:0;
    }
`
const PermissionEditModifyDiv=styled(PermissionEditDiv)`
    ${Media_Query_MD}{
        max-width: 610px;
    }
    ${Media_Query_SMD}{
        max-width: 610px;
    }
`
const PermissionModifyBtnDiv=styled(PermissionBtnDiv)`
    ${Media_Query_MD}{
        max-width: 610px;
    }
    ${Media_Query_SMD}{
        max-width: 610px;
    }
`

export const PermissionModify=({uid,userEmail,setDataChanged})=>{//for Modify area 
    const{permissionList,selectedItem,getPermissionItem}=useContext(NoteContext);
    const{id}=selectedItem;//選取的item的ID
    const{permissionEmail,owner,targetEmail}=permissionList;
    const[emailList,setEmailList]=useState();
    const[emailError,setEmailError]=useState([]);//處理從db來的錯誤訊息顯示
    const[emailErrorMes,setEmailErrorMes]=useState();//處理信箱格式檢查的錯誤顯示
    const[isModify,setIsModify]=useState(false);
    const[clickPermission,setClickPermission]=useState(false);
    const [loading, setLoading] = useState(false);//防止使用者重複點擊
    const handleSummit=async()=>{
        setLoading(true);
        const res=await savePermission(uid,id,emailList);
        const getRes=res.filter(item=> item.error);
        setEmailError( [...getRes]);
        setLoading(false);
        if(getRes.length>0) return//若有錯誤訊息返回，不設定setIsModify
        setDataChanged(true);
        setIsModify(true);
    }
    useEffect(()=>{
        const handleEmailList=async()=>{
            if(owner===true){
                const permissionEmailCopy=permissionEmail.slice(0);
                permissionEmailCopy.unshift(userEmail);
                const noRepeatValue=[...(new Set(permissionEmailCopy))];
                await queryUserImgByEmail(noRepeatValue,setEmailList);
            }else{
                const permissionEmailCopy=permissionEmail.slice(0);
                permissionEmailCopy.unshift(targetEmail);
                const noRepeatValue=[...(new Set(permissionEmailCopy))];
                await queryUserImgByEmail(noRepeatValue,setEmailList);
            }
        }
        handleEmailList();
        //載入資料庫permission資料
    },[])

    useEffect(()=>{
        if(!isModify) return
        setDataChanged(false);
        setIsModify(false);
        window.location.reload();
    },[isModify])

    return (
        <>
        <PermissionIcon onClick={()=>  {setClickPermission(!clickPermission)} }><IconTipText>協作者</IconTipText></PermissionIcon>   
        {clickPermission? 
        <>
        <PermissionModifyDiv>
        <PermissionEditModifyDiv>
            <PermissionTitleDiv>
                <PermissionTitleText>協作者</PermissionTitleText>
            </PermissionTitleDiv>
             {emailList.slice(0,1).map((item)=>{
                    const id=v4();
                    const{email,profileUrl}=item;
                    return(
                        <PermissionUserDiv key={id}> 
                        <UserPermission   id={id} email={email} profileUrl={profileUrl} />
                        <TextEmail>{email} (擁有者)</TextEmail> 
                        </PermissionUserDiv>
                    )
                })}
            {emailList.slice(1).map((item)=>{
                    const id=v4();
                    const{email,profileUrl}=item;
                    return(
                        <PermissionList  key={id} id={id} userEmail={email} profileUrl={profileUrl} setEmailList={setEmailList} />
                    )
            })}
            <PermissionInputDiv>
                <PermissionEdit emailList={emailList} setEmailList={setEmailList} setEmailErrorMes={setEmailErrorMes} setEmailError={setEmailError}/>
                <EmailErrorText >{emailErrorMes}</EmailErrorText>
            {emailError.length>0?
            <>
                {emailError.map(error=> {
                const id=v4();
                return(
                <EmailErrorText key={id}>{error.error}</EmailErrorText>
                    )
                 })
                }
            </> 
            :null}
            </PermissionInputDiv>
        </PermissionEditModifyDiv>
            <PermissionModifyBtnDiv>
                    <PermissionClose onClick={()=>  setClickPermission(!clickPermission) }>取消</PermissionClose>
                    <PermissionBtn loading={loading.toString()} disabled={loading} onClick={handleSummit}>儲存</PermissionBtn>
            </PermissionModifyBtnDiv>
        </PermissionModifyDiv>
        </>
        :null}
        </>
    )
}
