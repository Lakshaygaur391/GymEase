import React, { useEffect, useState } from 'react';
import API from '../utils/axiosInstance';
import CardMembershipOutlinedIcon from '@mui/icons-material/CardMembershipOutlined';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Addmembership = ({ onSuccess }) => {
  const [memberships, setMemberships] = useState([]);
  const [inputfield, setInputfield] = useState({ Months: "", Price: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchMemberships = async () => {
    try {
      const res = await API.get('/membership/all');
      if (res.data.success) {
        setMemberships(res.data.memberships || []);
      }
    } catch (err) {
      console.error("Error fetching memberships:", err);
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, []);

  const handleonchange = (event, name) => {
    setInputfield({ ...inputfield, [name]: event.target.value });
  };

  const handleAdd = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    if (!inputfield.Months || !inputfield.Price) {
      setErrorMsg("Please enter both Number of Months and Price");
      return;
    }
    try {
      setLoading(true);
      const res = await API.post('/membership/add', {
        No_of_Months: inputfield.Months,
        Price: inputfield.Price
      });
      if (res.data.success) {
        setSuccessMsg("Membership plan added successfully!");
        setInputfield({ Months: "", Price: "" });
        fetchMemberships();
        if (onSuccess) onSuccess();
      }
    } catch (err) {
      console.error("Add Membership Error:", err);
      setErrorMsg(err.response?.data?.Message || err.response?.data?.message || "Failed to add membership");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='w-full text-slate-100 p-2'>
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-500/15 border border-red-500/40 text-red-300 text-xs text-center rounded-xl flex items-center justify-center gap-2">
          <ErrorOutlineIcon fontSize="small" />
          <span>{errorMsg}</span>
        </div>
      )}
      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs text-center rounded-xl flex items-center justify-center gap-2">
          <CheckCircleOutlineIcon fontSize="small" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Existing Membership Plans Grid */}
      <div className="mb-4">
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Existing Membership Plans
        </label>
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 max-h-[35vh] overflow-y-auto pr-1'>
          {memberships.length === 0 ? (
            <div className="col-span-full text-center text-slate-400 py-6 bg-slate-950/40 rounded-2xl border border-slate-800 text-xs">
              No membership plans added yet. Create your first plan below!
            </div>
          ) : (
            memberships.map((item) => (
              <div key={item._id} className='bg-slate-950/80 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-indigo-500/40 transition shadow-md'>
                <div className="flex items-center gap-2 text-indigo-400 mb-2">
                  <CardMembershipOutlinedIcon fontSize="small" />
                  <span className='font-bold text-sm text-white'>{item.No_of_Months} Month Plan</span>
                </div>
                <div className='text-lg font-extrabold text-amber-400'>
                  ₹ {item.Price}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <hr className='border-slate-800 my-6' />

      {/* Add New Membership Form */}
      <div>
        <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
          Add New Membership Tier
        </label>
        <div className='flex flex-col sm:flex-row gap-3 items-center'>
          <input
            value={inputfield.Months}
            onChange={(event) => handleonchange(event, "Months")}
            className='w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm'
            type="number"
            placeholder='No. of Months (e.g. 3)'
          />
          <input
            value={inputfield.Price}
            onChange={(event) => handleonchange(event, "Price")}
            className='w-full sm:flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm'
            type="number"
            placeholder='Price in ₹ (e.g. 2500)'
          />
          <button
            disabled={loading}
            onClick={handleAdd}
            className='w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer transition disabled:opacity-50 text-sm flex items-center justify-center gap-2 flex-shrink-0'
          >
            <AddCircleOutlineIcon fontSize="small" />
            <span>{loading ? "Saving..." : "Add Plan"}</span>
          </button>
        </div>
      </div>

    </div>
  );
};

export default Addmembership;