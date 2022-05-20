import { useReducer,useContext } from "react";
import SearchContext from "./SearchContext";
import HeaderLoadContext from "../HeaderLoadContext";


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
    const{setIsLoading}=useContext(HeaderLoadContext);

    const getOriginData=(item)=>{
        setIsLoading(true);
        disDataPatch({
            type:"GETDATA",
            payload:item
        });
        setTimeout(()=>setIsLoading(false),1000);
    }
    const getFilterData=(item)=>{
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