import { useState,useEffect } from "react";
import { Routes, Route, useLocation,Navigate } from "react-router-dom";
import Topbar from "./Pages/common/Topbar";
import Sidebar from "./Pages/common/Sidebar";
import Dashboard from "./Pages/dashboard";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import LoginPage from "./Pages/Login/Login";
import Register from './Pages/Login/Register'
import Order from "./Pages/Login/Order";
import Ordertracking from "./Pages/Login/Ordertracking";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);
  const location = useLocation(); 
  const isLoginPage = location.pathname === "/";
  const [redirect, setredirect] = useState("")
  useEffect(() => {
    const redire = sessionStorage.getItem("isAuthProtected")

    setredirect(redire)
  }, [redirect])
  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
        
          {!isLoginPage && <Sidebar isSidebar={isSidebar} />}
          <main className="content">
    
            {!isLoginPage && <Topbar setIsSidebar={setIsSidebar} />}
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/Register" element={<Register />} />

              
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/Orders" element={<Order />} />
              <Route path="/Ordertracking" element={<Ordertracking />} />
              {/* <Route>
            {sessionStorage.getItem("isAuthProtected") === "false" ? (
              <Navigate to={{ pathname: "/login" }} />
            ) : null}
          </Route> */}
                         </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;