import { Route, Routes, BrowserRouter } from "react-router-dom";
import Home from "./pages/Home";
import MemberSignIn from "./pages/Member";
import { MemberSignUp } from "./pages/Member";
import AuthState from "./store/AuthState";
import AuthRequired from "./store/AuthRequired";
import HeadLoadState from "./header/HeaderLoadState";
import MemberShip from "./components/membership/MemberShip";
import Archive from "./pages/Archive";
import BoardPage from "./pages/Board";

function App() {
  return (
  
    <BrowserRouter>
      <AuthState>
      <HeadLoadState>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<MemberSignIn />} />
        <Route path="/signup" element={<MemberSignUp/> }/>
        <Route element={<AuthRequired />}>
        <Route path="/boarding/:id" element={<BoardPage />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/membership" element={<MemberShip />} />
        </Route>
      </Routes>   
      </HeadLoadState>
      </AuthState>
    </BrowserRouter>
    
  );
}

export default App;
