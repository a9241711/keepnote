import { useState } from "react";

const useHistoryPosition = (initialState) => {
    //customHook用use+自定義名稱，就可以製作自己的hook
    const [index, setIndex] = useState(0); //記錄所有圖形的位置
    const [history, setHistory] = useState([initialState]); //要記錄所有圖形的狀態[[],[{}],[{}]]
    const setState = (setElementValue, overwrite = false) => {
      //這裡的setState(setElementValue) ===下面的setElements
      const newState =
        typeof setElementValue === "function"
          ? setElementValue(history[index])
          : setElementValue; //setElements((prevState) => [...prevState, element]);or setElements(elementsCopy);
      if (overwrite) {
        //如果是true，表示是從updateElement傳入的
        const historyCopy = [...history];
        historyCopy[index] = newState;
        setHistory(historyCopy);
      } else {
        const updateState = [...history].slice(0, index + 1); //取0~最新狀態
        setHistory([...updateState, newState]); //
        setIndex((prev) => prev + 1);
        }     
    }; 
    const undo = () => {
        return index > 0 && setIndex((prev) => prev - 1);
    };
    const redo = () => {
        return index < history.length - 1 && setIndex((prev) => prev + 1);
    };
    //clear all
    const clear = () => {
        if (history.length !== 1) {
          setState([]);
        }
        return;
    };
    return [history[index],index, setState, undo, redo, clear];
  };

  export default useHistoryPosition