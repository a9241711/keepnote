import { useEffect, useLayoutEffect, useState,createContext } from "react";
import "./App.css";
import rough from "roughjs/bundled/rough.esm";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import Board from "./components/Board";
import BoardTry from "./components/BoardTry";
import Home from "./pages/Home";
import  ThemeProvider  from "./store";
import BoardIndex from "./components/BoardIndex";



function App() {
  return (
  
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/board" element={<Board />} />
        <Route path="/try" element={<BoardTry />} />
        <Route path="/boarding" element={<BoardIndex />} />
      </Routes>   
    </BrowserRouter>
    
  );
}

export default App;
