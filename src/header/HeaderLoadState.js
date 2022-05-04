import { useState } from "react"
import HeaderLoadContext from "./HeaderLoadContext"

const HeadLoadState=(props)=>{
    const[isLoading,setIsLoading]=useState(true);
    return(
        <HeaderLoadContext.Provider value={{isLoading,setIsLoading}}>
            {props.children}
        </HeaderLoadContext.Provider >
    )
}

export default HeadLoadState