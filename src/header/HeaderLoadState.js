import { useReducer, useState } from "react"
import HeaderLoadContext from "./HeaderLoadContext"


const handlePage=(state,action)=>{
    switch(action.type){
        case "HOME":
            return {home:true,archive:false};
        case "ARCHIVE":
            return {home:false,archive:true};
        case "CLICK":
            console.log(state,action,"Click")
            return action.payload;
        default :
            return state
    }

}

const HeadLoadState=(props)=>{
    const initialPage={home:true,archive:false};
    const initialNavClick=false;
    const[isLoading,setIsLoading]=useState(true);
    const[isRefresh,setIsRefresh]=useState(false);
    const[page,disPagePatch]=useReducer(handlePage,initialPage);
    const[navClick,disNavClickPatch]=useReducer(handlePage,initialNavClick);
    const getHome=()=>{
        disPagePatch({
            type:"HOME"
        })
    }
    const getArchive=()=>{
        disPagePatch({
            type:"ARCHIVE"
        })
    }
    const getNavClick=()=>{

        disNavClickPatch({
            type:"CLICK",
            payload:!navClick
        })
    }
    return(
        <HeaderLoadContext.Provider value={{isLoading,isRefresh,setIsRefresh,setIsLoading,getHome,getArchive,getNavClick,navClick:navClick,page:page}}>
            {props.children}
        </HeaderLoadContext.Provider >
    )
}

export default HeadLoadState