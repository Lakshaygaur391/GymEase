import React, { useEffect, useState } from 'react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FilterListOutlinedIcon from '@mui/icons-material/FilterListOutlined';
import { Link, useParams } from 'react-router-dom';
import Membercard from '../components/Membercard';
import API from '../utils/axiosInstance';

const GeneralUser = () => {
    const { page } = useParams();
    const [header, setHeader] = useState("");
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const func = page || sessionStorage.getItem("func");
        if (func) {
            setHeaderText(func);
            fetchMembers(func);
        }
    }, [page]);

    const setHeaderText = (func) => {
        switch (func) {
            case "Joined-Members":
                setHeader("Joined Members");
                break;
            case "Monthly-joined":
                setHeader("Monthly Joined");
                break;
            case "expire-within-3days":
                setHeader("Expiring Within 3 Days");
                break;
            case "Expire-within-4to7-days":
                setHeader("Expiring Within 4-7 Days");
                break;
            case "expired":
                setHeader("Expired Memberships");
                break;
            case "Inactive-members":
                setHeader("Inactive Members");
                break;
            default:
                setHeader(func);
                break;
        }
    };

    const fetchMembers = async (category) => {
        try {
            setLoading(true);
            const res = await API.get(`/member/specific/${category}`);
            if (res.data.success) {
                setMembers(res.data.members || []);
            }
        } catch (err) {
            console.error("Error fetching specific members:", err);
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className='w-full min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex-1 overflow-y-auto'>
        
        {/* Header nav bar */}
        <div className='w-full p-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md justify-between items-center flex flex-wrap gap-4 shadow-lg mb-6'>
            <div className="flex items-center gap-3">
                <Link to={"/dashboard"} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs font-semibold border border-slate-700/60">
                    <ArrowBackIcon fontSize="small"/>
                    <span>Back to Dashboard</span>
                </Link>
            </div>
            
            {header && (
                <div className='flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-wider'>
                    <FilterListOutlinedIcon fontSize="small" />
                    <span>{header}</span>
                </div>
            )}
        </div>

        <div className='flex items-center justify-between mb-6'>
            <h1 className='text-xl sm:text-2xl font-extrabold text-white tracking-tight'>
                Category: {header}
            </h1>
            <span className="text-xs text-slate-400 font-semibold bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
                {members.length} {members.length === 1 ? 'member' : 'members'}
            </span>
        </div>

        {/* Member cards grid */}
        <div className='bg-slate-900/40 border border-slate-800/80 p-4 sm:p-6 rounded-3xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 min-h-[300px] max-h-[72vh] overflow-y-auto'>
            {loading ? (
                <div className="col-span-full text-center py-16 text-slate-400 font-medium">Loading filtered members...</div>
            ) : members.length === 0 ? (
                <div className="col-span-full text-center py-16 text-slate-500 font-medium">No members found in this category.</div>
            ) : (
                members.map(member => (
                    <Membercard key={member._id} member={member} />
                ))
            )}
        </div>
    </div>
  );
};

export default GeneralUser;