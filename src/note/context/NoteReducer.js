import { useReducer } from "react";
import NoteContext from "./NoteContext";


const noteNoti=(state,action)=>{
    switch(action.type){
        case "UPDATENOTIFICATION":
            return {notification:action.payload}
        default:
            return state
    }
}
const noteColor=(state,action)=>{
    switch(action.type){
        case "UPDATECOLOR":
            return {updateColor:action.payload}
        default:
            return state
    }
}
const noteTitle=(state,action)=>{
    switch(action.type){
        case "UPDATETITLE":
            return {updateTitle:action.payload}
        default:
            return state
    }
}
const noteText=(state,action)=>{
    switch(action.type){
        case "UPDATETEXT":
            return {updateText:action.payload}
        default:
            return state
    }
}

const noteSelect=(state,action)=>{
    switch(action.type){
        case "SELECTED":
            return action.payload
        case "PERMISSION":
            return action.payload
        default:
            return state
    }
}

const noteHeight=(state,action)=>{
    switch(action.type){
        case "HEIGHT":
            return action.payload
        default:
            return state
    }
}
const NoteLoadState=(props)=>{
    const notification={
        timer:"",currentToken:""
    };
    const color={
        updateColor:"",
    };
    const title={
        updateTitle:"",
    };
    const text={
        updateText:"",
    }
    const selectedData={
        id:"",
        noteTitle:"",noteText:"",color:"#FFFFFF",image:"",board:[],whenToNotify:""
    }
    const noteHeightList={
        titleHeight:"",
        textHeight:""
    }
    const permissionInitialData={
        permissionEmail:[],owner:true,targetEmail:[]
    }
    const[updateNoti,disNotiPatch]=useReducer(noteNoti,notification);
    const[updateTitle,disTitlePatch]=useReducer(noteTitle,title);
    const[updateText,disTextPatch]=useReducer(noteText,text);
    const[updateColor,disColorPatch]=useReducer(noteColor,color);
    const[permissionList,disPermissionPatch]=useReducer(noteSelect,permissionInitialData)
    const[height,disHeightPatch]=useReducer(noteHeight,noteHeightList);
    const[selectedItem,disSelectedPatch]=useReducer(noteSelect,selectedData);
    const getNoteUpdateTitle=(updateTitle)=>{
        disTitlePatch({
            type:"UPDATETITLE",
            payload:updateTitle
        });
    };
    const getNoteUpdateText=(updateText)=>{
        disTextPatch({
            type:"UPDATETEXT",
            payload:updateText
        });
    };
    const getColorUpdate=(updateColor)=>{
        disColorPatch({
            type:"UPDATECOLOR",
            payload:updateColor
        });
    };
    const getNotificationUpdate=(timer,currentToken)=>{
        disNotiPatch({
            type:"UPDATENOTIFICATION",
            payload:{timer,currentToken}
        });
    };
    const getNoteHeight=(titleHeight,textHeight)=>{
        disHeightPatch({
            type:"HEIGHT",
            payload:{titleHeight,textHeight}
        })
    }
    const getSelectedItem=( id, noteText, noteTitle, index,image,time,color,whenToNotify,board)=>{
        disSelectedPatch({
            type:"SELECTED",
            payload:{ id, noteText, noteTitle, index,image,time,color,whenToNotify,board}
        });
    }
    const getPermissionItem=(permissionEmail,owner,targetEmail)=>{
        disPermissionPatch({
            type:"PERMISSION",
            payload:{permissionEmail,owner,targetEmail}
        })
    }

    return(
        <NoteContext.Provider value={{updateTitle:updateTitle.updateTitle,updateText:updateText.updateText,updateColor:updateColor.updateColor,updateNotification:updateNoti.notification,selectedItem,noteHeight:height,permissionList,getColorUpdate,getNotificationUpdate,getNoteUpdateTitle,getNoteUpdateText,getSelectedItem,getNoteHeight,getPermissionItem}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteLoadState

