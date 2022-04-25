import { Children } from "react";
import { createContext } from "react";


 const BoardContext=createContext(theme);

const theme={
    color:"red"
}

export default BoardContext