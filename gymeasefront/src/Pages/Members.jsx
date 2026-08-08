import React, { useEffect, useState } from 'react';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined';
import { Link } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import KeyboardArrowLeftOutlinedIcon from '@mui/icons-material/KeyboardArrowLeftOutlined';
import ChevronRightOutlinedIcon from '@mui/icons-material/ChevronRightOutlined';
import Membercard from '../components/Membercard';
import Model from '../components/Model';
import Addmembership from '../components/Addmembership';
import Addmembers from '../components/Addmembers';
import API from '../utils/axiosInstance';

const Members = () => {
  const [addmembership, setAddmembership] = useState(false);
  const [addmembers, setAddmembers] = useState(false);

  const [members, setMembers] = useState([]);
  const [currentpage, setCurrentpage] = useState(1);
  const [totaldata, setTotaldata] = useState(0);
  const [noofpage, setNoofpage] = useState(1);
  const [limit] = useState(9);
  const [search, setSearch] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchdata = async (page = currentpage, searchVal = searchTerm) => {
    try {
      setLoading(true);
      const res = await API.get('/member/all', {
        params: { page, limit, search: searchVal }
      });
      if (res.data.success) {
        setMembers(res.data.members || []);
        setTotaldata(res.data.totalMembers || 0);
        setNoofpage(res.data.totalPages || 1);
        setCurrentpage(res.data.currentPage || 1);
      }
    } catch (err) {
      console.error("Error fetching members:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchdata(currentpage, searchTerm);
  }, [currentpage, searchTerm]);

  const handleSearchSubmit = () => {
    setCurrentpage(1);
    setSearchTerm(search);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleaddmembers = () => {
    setAddmembers(prev => !prev);
  };

  const handlemembership = () => {
    setAddmembership(prev => !prev);
  };

  const handleprev = () => {
    if (currentpage > 1) {
      setCurrentpage(prev => prev - 1);
    }
  };

  const handlenext = () => {
    if (currentpage < noofpage) {
      setCurrentpage(prev => prev + 1);
    }
  };

  const startfrom = totaldata === 0 ? 0 : (currentpage - 1) * limit + 1;
  const endto = Math.min(currentpage * limit, totaldata);

  return (
    <div className='w-full min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex-1 overflow-y-auto'>
      
      {/* Top Bar Header */}
      <div className='w-full p-4 rounded-2xl border border-slate-800 bg-slate-900/80 backdrop-blur-md justify-between items-center flex flex-wrap gap-4 shadow-lg mb-6'>
        
        <div className="flex items-center gap-3">
          <Link to={'/dashboard'} className='flex items-center gap-1 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition text-xs font-semibold border border-slate-700/60'>
            <ArrowBackIcon fontSize="small" />
            <span>Dashboard</span>
          </Link>
          <h1 className="text-xl font-extrabold text-white tracking-tight">Member Roster</h1>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={handleaddmembers} 
            className='px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-emerald-600/25 cursor-pointer transition flex items-center gap-2'
          >
            <PersonAddOutlinedIcon fontSize="small" />
            <span>Add Member</span>
          </button>
          
          <button 
            onClick={handlemembership} 
            className='px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 cursor-pointer transition flex items-center gap-2'
          >
            <CardMembershipOutlinedIcon fontSize="small" />
            <span>Membership Plans</span>
          </button>
        </div>

      </div>

      {/* Controls & Search Row */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
        
        {/* Search Bar */}
        <div className='w-full sm:w-80 md:w-96 flex gap-2'>
          <div className="relative flex-1">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              className='w-full pl-4 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition'
              type="text"
              placeholder='Search member name or phone...'
            />
          </div>
          <button 
            onClick={handleSearchSubmit} 
            className='bg-slate-800 hover:bg-slate-700 p-2.5 text-white rounded-xl cursor-pointer transition border border-slate-700 flex items-center justify-center'
          >
            <SearchOutlinedIcon fontSize="small" />
          </button>
        </div>

        {/* Pagination & Counter */}
        <div className='flex items-center gap-3 text-xs text-slate-400 bg-slate-900/60 p-2 px-4 rounded-xl border border-slate-800/80'>
          <span className="font-semibold text-slate-200">
            {startfrom}-{endto} of {totaldata}
          </span>
          <div className="flex gap-1 items-center">
            <button
              disabled={currentpage === 1}
              onClick={handleprev}
              className='p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 disabled:hover:bg-slate-800 transition cursor-pointer border border-slate-700'
            >
              <KeyboardArrowLeftOutlinedIcon fontSize="small" />
            </button>
            <span className="px-2 text-slate-300 font-bold">{currentpage}/{noofpage}</span>
            <button
              disabled={currentpage >= noofpage}
              onClick={handlenext}
              className='p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 disabled:hover:bg-slate-800 transition cursor-pointer border border-slate-700'
            >
              <ChevronRightOutlinedIcon fontSize="small" />
            </button>
          </div>
        </div>

      </div>

      {/* Member Cards Grid */}
      <div className='w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-slate-900/40 border border-slate-800/80 rounded-3xl p-4 sm:p-6 min-h-[300px] max-h-[68vh] overflow-y-auto'>
        {loading ? (
          <div className="col-span-full text-center py-16 text-slate-400 font-medium">Loading members...</div>
        ) : members.length === 0 ? (
          <div className="col-span-full text-center py-16 text-slate-500 font-medium">
            No members found matching your search.
          </div>
        ) : (
          members.map(member => (
            <Membercard key={member._id} member={member} />
          ))
        )}
      </div>

      {/* Modals */}
      {addmembership &&
        <Model handleclick={handlemembership} content={<Addmembership onSuccess={() => { handlemembership(); fetchdata(); }} />} header="Manage Membership Plans" />
      }

      {addmembers && 
        <Model handleclick={handleaddmembers} content={<Addmembers onSuccess={() => { handleaddmembers(); fetchdata(); }} />} header="Add New Member" />
      }
    </div>
  );
};

export default Members;