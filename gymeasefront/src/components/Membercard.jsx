import React from 'react';
import { Link } from 'react-router-dom';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import EventOutlinedIcon from '@mui/icons-material/EventOutlined';

const Membercard = ({ member }) => {
  if (!member) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const isActive = member.status === 'active';

  return (
    <Link to={`/members/${member._id}`} className="block group">
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-indigo-500/50 hover:bg-slate-850 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 relative flex flex-col items-center text-center">

        {/* Status Pill Badge */}
        <span className={`absolute top-4 right-4 text-[10px] uppercase font-extrabold tracking-wider px-2.5 py-0.5 rounded-full border ${isActive
          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
          : 'bg-rose-500/15 text-rose-400 border-rose-500/30'
          }`}>
          {isActive ? 'Active' : 'Inactive'}
        </span>

        {/* Member Avatar */}
        <div className="relative mb-3 mt-1">
          <img
            className={`w-20 h-20 rounded-full object-cover p-1 border-2 ${isActive ? 'border-emerald-500 shadow-lg shadow-emerald-500/20' : 'border-rose-500/60'
              }`}
            src={member.ProfilePic || "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQzqhmiOmD6_cV5LZKYXen_OjjxPmhWQo9SSA&s"}
            alt={member.Name}
          />
        </div>

        {/* Member Info */}
        <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition truncate w-full">
          {member.Name}
        </h3>

        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mt-1">
          <PhoneOutlinedIcon fontSize="inherit" className="text-slate-500" />
          <span>+91 {member.Phone_Number}</span>
        </div>

        {/* Next Bill Badge */}
        <div className="mt-4 pt-3 border-t border-slate-800/80 w-full flex items-center justify-center gap-1.5 text-xs font-semibold text-slate-300 bg-slate-950/40 py-2 rounded-xl border border-slate-800">
          <EventOutlinedIcon fontSize="inherit" className="text-emerald-400" />
          <span>Due: {formatDate(member.nextPaymentDueDate)}</span>
        </div>

      </div>
    </Link>
  );
};

export default Membercard;