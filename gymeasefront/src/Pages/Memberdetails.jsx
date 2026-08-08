import React, { useEffect, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useNavigate, useParams } from "react-router-dom";
import Switch from "react-switch";
import API from "../utils/axiosInstance";

const Memberdetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [member, setMember] = useState(null);
  const [memberships, setMemberships] = useState([]);
  const [selectedMembership, setSelectedMembership] = useState("");
  const [renew, setRenew] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchMember = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/member/details/${id}`);
      if (res.data.success) {
        setMember(res.data.member);
      }
    } catch (err) {
      console.error("Error fetching member details:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMemberships = async () => {
    try {
      const res = await API.get('/membership/all');
      if (res.data.success && res.data.memberships.length > 0) {
        setMemberships(res.data.memberships);
        setSelectedMembership(res.data.memberships[0]._id);
      }
    } catch (err) {
      console.error("Error fetching memberships:", err);
    }
  };

  useEffect(() => {
    fetchMember();
    fetchMemberships();
  }, [id]);

  const handleswitchbutton = async () => {
    if (!member) return;
    const newStatus = member.status === "active" ? "inactive" : "active";
    try {
      setActionLoading(true);
      const res = await API.put(`/member/status/${id}`, { status: newStatus });
      if (res.data.success) {
        setMember(res.data.member);
        setMessage(`Member status updated to ${newStatus}`);
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error("Error toggling status:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSaveRenewal = async () => {
    if (!selectedMembership) return;
    try {
      setActionLoading(true);
      const res = await API.put(`/member/renew/${id}`, { membershipId: selectedMembership });
      if (res.data.success) {
        setMember(res.data.member);
        setRenew(false);
        setMessage("Membership renewed successfully!");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (err) {
      console.error("Error renewing membership:", err);
    } finally {
      setActionLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A";
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-8">
        <div className="text-center font-semibold text-slate-400">Loading member profile...</div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-8">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white transition text-xs font-semibold mb-6"
        >
          <ArrowBackIcon fontSize="small" /> <span>Back</span>
        </button>
        <div className="text-xl text-rose-400 font-bold">Member record not found.</div>
      </div>
    );
  }

  const isActive = member.status === 'active';

  return (
    <div className="w-full min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex-1 overflow-y-auto">
      
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => { navigate(-1); }}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-white transition text-xs font-semibold shadow"
        >
          <ArrowBackIcon fontSize="small" />
          <span>Back to Roster</span>
        </button>
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
          MEMBER PROFILE
        </span>
      </div>

      {message && (
        <div className="mb-6 p-3 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm text-center rounded-xl font-medium flex items-center justify-center gap-2">
          <CheckCircleOutlineIcon fontSize="small" />
          <span>{message}</span>
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-md mb-8">
        
        <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">

          {/* Member Photo */}
          <div className="relative flex-shrink-0">
            <img
              className={`w-36 h-36 sm:w-44 sm:h-44 object-cover rounded-2xl p-1 border-2 shadow-2xl ${
                isActive ? 'border-emerald-500 shadow-emerald-500/20' : 'border-rose-500/60'
              }`}
              src={member.ProfilePic || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQHocDGl6rP_Qheul8pRJo1gFyzYzHQc9oaBw&s"}
              alt={member.Name}
            />
            <span className={`absolute -bottom-2 -right-2 text-[10px] uppercase font-extrabold tracking-wider px-3 py-1 rounded-full border shadow-lg ${
              isActive 
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-extrabold' 
                : 'bg-rose-500 text-white border-rose-400 font-extrabold'
            }`}>
              {isActive ? 'Active' : 'Inactive'}
            </span>
          </div>

          {/* Member Info & Controls */}
          <div className="flex-1 w-full space-y-4">
            
            <div className="border-b border-slate-800 pb-4">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {member.Name}
              </h2>
              <p className="text-xs text-slate-400 mt-1">Gym Member ID: #{member._id.slice(-6).toUpperCase()}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <PhoneOutlinedIcon fontSize="small" className="text-indigo-400" />
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Mobile</div>
                  <div className="text-sm font-bold text-slate-200">+91 {member.Phone_Number}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <HomeOutlinedIcon fontSize="small" className="text-indigo-400" />
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Address</div>
                  <div className="text-sm font-bold text-slate-200 truncate max-w-[180px]">{member.Address}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <CalendarTodayOutlinedIcon fontSize="small" className="text-indigo-400" />
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Joined Date</div>
                  <div className="text-sm font-bold text-slate-200">{formatDate(member.lastPaymentDate || member.createdAt)}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <EventAvailableOutlinedIcon fontSize="small" className="text-amber-400" />
                <div>
                  <div className="text-[10px] uppercase font-semibold text-slate-400">Next Payment Due</div>
                  <div className="text-sm font-extrabold text-amber-400">{formatDate(member.nextPaymentDueDate)}</div>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
              
              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-slate-300">Account Status:</span>
                <Switch
                  onColor="#10b981"
                  offColor="#ef4444"
                  checked={isActive}
                  onChange={handleswitchbutton}
                  disabled={actionLoading}
                />
              </div>

              <button
                onClick={() => setRenew((prev) => !prev)}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold text-white transition flex items-center gap-2 cursor-pointer shadow-lg ${
                  renew && isActive ? "bg-amber-600 hover:bg-amber-500 shadow-amber-600/30" : "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 shadow-indigo-600/30"
                }`}
              >
                <AutorenewOutlinedIcon fontSize="small" />
                <span>{renew ? "Close Renew Panel" : "Renew Membership"}</span>
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* Renew Panel */}
      {renew && isActive && (
        <div className="p-6 bg-slate-900/90 border border-slate-800 rounded-3xl shadow-2xl max-w-xl mx-auto mb-8 animate-in fade-in duration-200">
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <AutorenewOutlinedIcon className="text-amber-400" />
            <span>Select Membership Plan for Renewal</span>
          </h3>

          <div className="space-y-4">
            <select
              value={selectedMembership}
              onChange={(e) => setSelectedMembership(e.target.value)}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-sm"
            >
              {memberships.map(m => (
                <option key={m._id} value={m._id} className="bg-slate-900 text-white">
                  {m.No_of_Months} Month Plan — ₹ {m.Price}
                </option>
              ))}
            </select>

            <button
              disabled={actionLoading}
              onClick={handleSaveRenewal}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 cursor-pointer transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
            >
              <CheckCircleOutlineIcon fontSize="small" />
              <span>{actionLoading ? "Processing Renewal..." : "Confirm & Save Renewal"}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default Memberdetails;
