import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import BoardIndex from "./components/board/BoardIndex";
import MemberSignIn from "./pages/Member";
import { MemberSignUp } from "./pages/Member";
import AuthState from "./store/AuthState";
import AuthRequired from "./store/AuthRequired";
import HeadLoadState from "./header/HeaderLoadState";
import Archive from "./note/archive/Archive";


function App() {
  return (
  
    <BrowserRouter>
      <AuthState>
      <HeadLoadState>
      <Routes>
        <Route path="/" element={<Home />} />
        {/* <Route path="/board" element={<Board />} />
        <Route path="/try" element={<BoardTry />} /> */}
        <Route path="/login" element={<MemberSignIn />} />
        <Route path="/signup" element={<MemberSignUp/> }/>
        <Route element={<AuthRequired />}>
        <Route path="/boarding" element={<BoardIndex />} />
        <Route path="/archive" element={<Archive />} />
        </Route>
      </Routes>   
      </HeadLoadState>
      </AuthState>
    </BrowserRouter>
    
  );
}

export default App;
