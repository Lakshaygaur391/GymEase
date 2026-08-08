import React, { useState, useEffect } from "react";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import LogoutIcon from "@mui/icons-material/Logout";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import { Link, useLocation, useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [greeting, setGreeting] = useState("");
  const [gymInfo, setGymInfo] = useState(null);

  const handlelogout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      console.error("Logout API error:", err);
    } finally {
      sessionStorage.removeItem("islogin");
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("gym");
      navigate("/");
    }
  };

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good Morning");
    else if (hour < 18) setGreeting("Good Afternoon");
    else if (hour < 21) setGreeting("Good Evening");
    else setGreeting("Good Night");

    const cachedGym = sessionStorage.getItem("gym");
    if (cachedGym) {
      try {
        setGymInfo(JSON.parse(cachedGym));
      } catch (e) {
        console.error(e);
      }
    }

    API.get('/auth/me')
      .then(res => {
        if (res.data.success) {
          setGymInfo(res.data.gym);
          sessionStorage.setItem("gym", JSON.stringify(res.data.gym));
        }
      })
      .catch(err => console.error("Error fetching gym profile:", err));
  }, []);

  return (
    <>
      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`
        fixed md:static top-0 left-0 min-h-screen w-64 bg-slate-900/95 border-r border-slate-800/80 backdrop-blur-xl p-5 z-50
        flex flex-col justify-between transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 shadow-2xl shadow-indigo-950/20
      `}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 flex-shrink-0">
              <FitnessCenterIcon className="text-white transform -rotate-45" fontSize="small" />
            </div>
            <div className="overflow-hidden">
              <h2 className="text-lg font-extrabold text-white tracking-tight truncate">
                {gymInfo?.Gym_Name || "GymEase Club"}
              </h2>
              <span className="text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/30">
                ADMIN CONSOLE
              </span>
            </div>
          </div>

          {/* User Profile Card */}
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700/50 mb-6">
            <div className="relative">
              <img
                src={gymInfo?.Profilepic || "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"}
                className="w-11 h-11 rounded-xl object-cover border border-slate-600 shadow"
                alt="Gym Avatar"
              />
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 border-2 border-slate-900 rounded-full" />
            </div>
            <div className="overflow-hidden">
              <div className="text-xs text-slate-400 font-medium">{greeting}</div>
              <div className="text-sm font-bold text-slate-100 truncate">{gymInfo?.Username || "Admin"}</div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2">
            <Link to="/dashboard">
              <div
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition duration-200 ${
                  location.pathname === "/dashboard"
                    ? "bg-gradient-to-r from-indigo-600/30 to-indigo-600/10 text-white border-l-4 border-indigo-500 font-semibold shadow-inner"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <HomeIcon fontSize="small" className={location.pathname === "/dashboard" ? "text-indigo-400" : "text-slate-400"} />
                <span className="text-sm">Dashboard</span>
              </div>
            </Link>

            <Link to="/members">
              <div
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer transition duration-200 ${
                  location.pathname === "/members"
                    ? "bg-gradient-to-r from-indigo-600/30 to-indigo-600/10 text-white border-l-4 border-indigo-500 font-semibold shadow-inner"
                    : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"
                }`}
              >
                <PeopleAltIcon fontSize="small" className={location.pathname === "/members" ? "text-indigo-400" : "text-slate-400"} />
                <span className="text-sm">Members</span>
              </div>
            </Link>
          </nav>
        </div>

        {/* Footer Logout Button */}
        <div className="pt-4 border-t border-slate-800/80">
          <div
            onClick={handlelogout}
            className="flex items-center gap-3 px-3.5 py-3 rounded-xl cursor-pointer text-slate-400 hover:bg-red-500/15 hover:text-red-300 border border-transparent hover:border-red-500/30 transition duration-200 group"
          >
            <LogoutIcon fontSize="small" className="text-slate-400 group-hover:text-red-400" />
            <span className="text-sm font-medium">Sign Out</span>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;