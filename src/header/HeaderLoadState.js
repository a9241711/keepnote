import { useState } from "react"
import HeaderLoadContext from "./HeaderLoadContext"

const HeadLoadState=(props)=>{
    const[isLoading,setIsLoading]=useState(true);
    const[isRefresh,setIsRefresh]=useState(false);
    return(
        <HeaderLoadContext.Provider value={{isLoading,isRefresh,setIsRefresh,setIsLoading}}>
            {props.children}
        </HeaderLoadContext.Provider >
    )
}

export default HeadLoadState