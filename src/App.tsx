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
import NotFound from "./components/404";

function App() {
  return (
    <BrowserRouter>
      <AuthState>
        <HeadLoadState>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<MemberSignIn />} />
            <Route path="/signup" element={<MemberSignUp />} />

            <Route element={<AuthRequired />}>
              <Route path="/boarding/:id" element={<BoardPage />} />
              <Route path="/archive" element={<Archive />} />
              <Route path="/membership" element={<MemberShip />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </HeadLoadState>
      </AuthState>
    </BrowserRouter>
  );
}

export default App;
