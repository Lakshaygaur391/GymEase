import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import MenuIcon from "@mui/icons-material/Menu";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import PersonOffOutlinedIcon from "@mui/icons-material/PersonOffOutlined";
import DateRangeOutlinedIcon from "@mui/icons-material/DateRangeOutlined";
import { Link } from "react-router-dom";
import API from "../utils/axiosInstance";

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [stats, setStats] = useState({
    totalJoined: 0,
    monthlyJoined: 0,
    expireIn3Days: 0,
    expireIn4To7Days: 0,
    expired: 0,
    inactive: 0
  });
  const [gymProfile, setGymProfile] = useState(null);

  const handleOnclickMenu = (value) => {
    sessionStorage.setItem("func", value);
  };

  useEffect(() => {
    API.get('/member/stats')
      .then(res => {
        if (res.data.success) {
          setStats(res.data.stats);
        }
      })
      .catch(err => console.error("Error fetching stats:", err));

    API.get('/auth/me')
      .then(res => {
        if (res.data.success) {
          setGymProfile(res.data.gym);
        }
      })
      .catch(err => console.error("Error fetching profile:", err));
  }, []);

  const todayDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  return (
    <div className="flex w-full min-h-screen bg-slate-950 text-slate-100">

      {/* Sidebar Navigation */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} />

      {/* Main Dashboard Panel */}
      <div className="flex-1 p-4 md:p-8 w-full overflow-y-auto max-h-screen">

        {/* Top Navbar */}
        <div className="flex justify-between items-center bg-slate-900/80 border border-slate-800 backdrop-blur-md p-4 rounded-2xl shadow-lg mb-8">
          
          <div className="flex items-center gap-3">
            <MenuIcon
              onClick={() => setIsOpen(true)}
              className="cursor-pointer md:hidden text-slate-300 hover:text-white"
            />
            <div>
              <h1 className="font-extrabold text-xl md:text-2xl text-white tracking-tight">
                Dashboard Overview
              </h1>
              <p className="text-xs text-slate-400 hidden sm:block">Real-time club metrics & membership activity</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs font-semibold text-slate-300">
              <DateRangeOutlinedIcon fontSize="small" className="text-emerald-400" />
              <span>{todayDate}</span>
            </div>

            <div className="relative">
              <img
                className="w-10 h-10 rounded-xl border-2 border-indigo-500/50 object-cover shadow-md"
                src={gymProfile?.Profilepic || "https://t4.ftcdn.net/jpg/02/29/75/83/360_F_229758328_7x8jwCwjtBMmC6rgFzLFhZoEpLobB6L8.jpg"}
                alt="Profile Avatar"
              />
            </div>
          </div>

        </div>

        {/* Dashboard Grid Cards */}
        <div className="grid gap-6 lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1">

          <StatCard
            to="/specific/Joined-Members"
            icon={<PeopleAltOutlinedIcon className="text-emerald-400" fontSize="large" />}
            accentBg="bg-emerald-500/10 border-emerald-500/30"
            badgeBg="bg-emerald-500/20 text-emerald-300"
            title="Total Joined Members"
            subtitle="Active gym roster count"
            count={stats.totalJoined}
            onClick={() => handleOnclickMenu("Joined-Members")}
          />

          <StatCard
            to="/specific/Monthly-joined"
            icon={<TrendingUpOutlinedIcon className="text-indigo-400" fontSize="large" />}
            accentBg="bg-indigo-500/10 border-indigo-500/30"
            badgeBg="bg-indigo-500/20 text-indigo-300"
            title="Monthly Joined"
            subtitle="New members this month"
            count={stats.monthlyJoined}
            onClick={() => handleOnclickMenu("Monthly-joined")}
          />

          <StatCard
            to="/specific/expire-within-3days"
            icon={<AccessTimeOutlinedIcon className="text-amber-400" fontSize="large" />}
            accentBg="bg-amber-500/10 border-amber-500/30"
            badgeBg="bg-amber-500/20 text-amber-300"
            title="Expiring Within 3 Days"
            subtitle="Urgent renewal reminders"
            count={stats.expireIn3Days}
            onClick={() => handleOnclickMenu("expire-within-3days")}
          />

          <StatCard
            to="/specific/Expire-within-4to7-days"
            icon={<AccessTimeOutlinedIcon className="text-sky-400" fontSize="large" />}
            accentBg="bg-sky-500/10 border-sky-500/30"
            badgeBg="bg-sky-500/20 text-sky-300"
            title="Expiring Within 4-7 Days"
            subtitle="Upcoming renewal targets"
            count={stats.expireIn4To7Days}
            onClick={() => handleOnclickMenu("Expire-within-4to7-days")}
          />

          <StatCard
            to="/specific/expired"
            icon={<ErrorOutlineOutlinedIcon className="text-rose-400" fontSize="large" />}
            accentBg="bg-rose-500/10 border-rose-500/30"
            badgeBg="bg-rose-500/20 text-rose-300"
            title="Expired Memberships"
            subtitle="Overdue payments required"
            count={stats.expired}
            onClick={() => handleOnclickMenu("expired")}
          />

          <StatCard
            to="/specific/Inactive-members"
            icon={<PersonOffOutlinedIcon className="text-slate-400" fontSize="large" />}
            accentBg="bg-slate-500/10 border-slate-500/30"
            badgeBg="bg-slate-500/20 text-slate-300"
            title="Inactive Members"
            subtitle="Paused or inactive profiles"
            count={stats.inactive}
            onClick={() => handleOnclickMenu("Inactive-members")}
          />

        </div>

        {/* Support Banner */}
        <div className="mt-12 p-4 bg-slate-900/60 border border-slate-800 rounded-2xl text-center text-xs text-slate-400">
          GymEase Management System • Technical Assistance available 24/7
        </div>

      </div>
    </div>
  );
};

/* Reusable Glass Stat Card Component */
const StatCard = ({ to, icon, accentBg, badgeBg, title, subtitle, count, onClick }) => (
  <Link to={to}>
    <div
      onClick={onClick}
      className={`p-6 rounded-2xl glass-card border transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-indigo-500/10 cursor-pointer flex flex-col justify-between group ${accentBg}`}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-700/50 group-hover:scale-110 transition duration-300">
          {icon}
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${badgeBg}`}>
          Category
        </span>
      </div>

      <div>
        <h3 className="text-3xl font-extrabold text-white tracking-tight mb-1">
          {count}
        </h3>
        <p className="text-base font-bold text-slate-200 group-hover:text-white transition">
          {title}
        </p>
        <p className="text-xs text-slate-400 mt-1">
          {subtitle}
        </p>
      </div>
    </div>
  </Link>
);

export default Dashboard;