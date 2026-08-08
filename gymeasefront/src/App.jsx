import './App.css'
import { Home } from './Pages/Home'
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom'
import Dashboard from './Pages/Dashboard'
import { useState, useEffect } from 'react'
import Members from './Pages/Members'
import GeneralUser from './Pages/GeneralUser'
import Memberdetails from './Pages/Memberdetails'


function App() {
  const [islogin, setIslogin] = useState(Boolean(sessionStorage.getItem("islogin")));
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const isLoggedin = sessionStorage.getItem("islogin");
    if (isLoggedin) {
      setIslogin(true);
    } else {
      setIslogin(false);
      if (location.pathname !== "/") {
        navigate("/");
      }
    }
  }, [location.pathname]);

  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />

        {islogin && (
          <Route
            path="/*"
            element={
              <div className="flex">
                <Routes>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/members" element={<Members />} />
                  <Route path="/specific/:page" element={<GeneralUser />} />
                  <Route path="/members/:id" element={<Memberdetails />} />
                </Routes>
              </div>
            }
          />
        )}
      </Routes>
    </div>
  );
} export default App