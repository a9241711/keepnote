import { useReducer } from "react";
import SearchContext from "./SearchContext";


const handleSearch=(state,action)=>{
    switch (action.type){
        case "GETDATA":
            console.log(state,action)
            return {dataList:action.payload,isFilter:false} ;
        case "FILTER":
            return {filterDataList:action.payload,isFilter:true} ;
        case "CLEAR":
            return {filterDataList:null,isFilter:false} ;
        case "FILTERBUTDATA":
            return action.payload ;
        default :
        return state
    }
}

const SearchReducer=(props)=>{
    const initialData={
        id:"",
        noteTitle:"",
        noteText:"",
        image:"",
        time:"",
        color:"#FFFFFF",
        whenToNotify:""
    }
    const initialFilter={filterDataList:null,isFilter:false};
    const[dataList,disDataPatch]=useReducer(handleSearch,initialData);
    const[filterData,disFilterPatch]=useReducer(handleSearch,initialFilter);
    const[filterButDataChange,disFilterDataChange]=useReducer(handleSearch,false);

    const getOriginData=(item)=>{
        console.log(item)
        disDataPatch({
            type:"GETDATA",
            payload:item
        })
    }
    const getFilterData=(item)=>{
        console.log(item)
        disFilterPatch({
            type:"FILTER",
            payload:item
        })
    }
    const clearFilterData=()=>{
        disFilterPatch({
            type:"CLEAR",
        })
    }
    const getFilterButDataChange=(boolean)=>{
        disFilterDataChange({
            type:"FILTERBUTDATA",
            payload:boolean
        })
    }
    return(
        <SearchContext.Provider value={{getFilterButDataChange,getOriginData,getFilterData,clearFilterData,dataList:dataList,filterData:filterData,filterButDataChange}}>
            {props.children}
        </SearchContext.Provider>
    )
}

export default SearchReducer;