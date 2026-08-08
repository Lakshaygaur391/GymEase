import React, { useEffect, useState } from "react";
import axios from "axios";
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import API from "../utils/axiosInstance";
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';

const Addmembers = ({ onSuccess }) => {
  const [inputfield, setInputfield] = useState({
    Name: "",
    Mobile_No: "",
    Address: "",
    Date: new Date().toISOString().split('T')[0],
    Membership: "",
    ProfilePic: "https://png.pngtree.com/png-vector/20191110/ourmid/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_1978396.jpg"
  });
  const [memberships, setMemberships] = useState([]);
  const [loaderimage, setLoaderimage] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    API.get('/membership/all')
      .then(res => {
        if (res.data.success && res.data.memberships.length > 0) {
          setMemberships(res.data.memberships);
          setInputfield(prev => ({ ...prev, Membership: res.data.memberships[0]._id }));
        }
      })
      .catch(err => console.error("Error fetching memberships:", err));
  }, []);

  const handleonchange = (event, name) => {
    setInputfield({ ...inputfield, [name]: event.target.value });
  };

  const uploadimage = async (event) => {
    setLoaderimage(true);
    console.log("Uploading image...");

    const file = event.target.files[0];
    if (!file) {
      setLoaderimage(false);
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "gym-ease");

    try {
      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dixmkh7hd/image/upload",
        data
      );

      console.log("Image URL:", response.data.secure_url);
      setLoaderimage(false);

      setInputfield((prev) => ({
        ...prev,
        ProfilePic: response.data.secure_url,
      }));

    } catch (error) {
      console.error("Error uploading image:", error);
      setLoaderimage(false);
    }
  };

  const handleRegisterMember = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!inputfield.Name || !inputfield.Mobile_No || !inputfield.Address || !inputfield.Membership) {
      setErrorMsg("Please fill in Name, Mobile Number, Address, and choose a Membership plan");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/member/add', {
        Name: inputfield.Name,
        Mobile_No: inputfield.Mobile_No,
        Address: inputfield.Address,
        Date: inputfield.Date,
        membership: inputfield.Membership,
        ProfilePic: inputfield.ProfilePic
      });

      if (res.data.success) {
        setSuccessMsg("Member registered successfully!");
        setTimeout(() => {
          if (onSuccess) onSuccess();
        }, 1000);
      }
    } catch (err) {
      console.error("Error adding member:", err);
      setErrorMsg(err.response?.data?.Message || err.response?.data?.message || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full text-slate-100 p-2">

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Member Name
          </label>
          <input
            value={inputfield.Name}
            onChange={(event) => handleonchange(event, "Name")}
            type="text"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
            placeholder="Full Name"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Mobile Number
          </label>
          <input
            value={inputfield.Mobile_No}
            onChange={(event) => handleonchange(event, "Mobile_No")}
            type="text"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
            placeholder="10-digit mobile number"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Residential Address
          </label>
          <input
            value={inputfield.Address}
            onChange={(event) => handleonchange(event, "Address")}
            type="text"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
            placeholder="City / Address"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Joining Date
          </label>
          <input
            value={inputfield.Date}
            onChange={(event) => handleonchange(event, "Date")}
            type="date"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Select Membership Plan
          </label>
          <select
            value={inputfield.Membership}
            onChange={(event) => handleonchange(event, "Membership")}
            className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-sm"
          >
            {memberships.length === 0 ? (
              <option value="" className="bg-slate-900 text-white">No membership plans created yet - create one first!</option>
            ) : (
              memberships.map((m) => (
                <option key={m._id} value={m._id} className="bg-slate-900 text-white">
                  {m.No_of_Months} Month Plan — ₹ {m.Price}
                </option>
              ))
            )}
          </select>
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
            Member Photo
          </label>
          <label className="flex items-center justify-center gap-2 p-3 bg-slate-950 border border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-indigo-500 transition text-slate-400 hover:text-white text-xs">
            <CloudUploadOutlinedIcon fontSize="small" />
            <span>Upload Profile Photo</span>
            <input type="file" onChange={(e) => uploadimage(e)} className="hidden" />
          </label>
        </div>

      </div>

      {loaderimage && (
        <div className="mt-3">
          <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={1}>
            <LinearProgress color="secondary" />
          </Stack>
        </div>
      )}

      {/* Image Preview & Submit */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-6 pt-4 border-t border-slate-800 gap-4">

        <div className="flex items-center gap-3">
          {inputfield.ProfilePic && (
            <div className="w-14 h-14 rounded-full p-0.5 bg-gradient-to-tr from-indigo-500 to-emerald-400 shadow">
              <img
                className="w-full h-full object-cover rounded-full"
                src={inputfield.ProfilePic}
                alt="Member Preview"
              />
            </div>
          )}
          <span className="text-xs text-slate-400">Photo preview</span>
        </div>

        <button
          disabled={loading || memberships.length === 0}
          onClick={handleRegisterMember}
          className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer transition disabled:opacity-50 text-sm flex items-center justify-center gap-2"
        >
          <PersonAddOutlinedIcon fontSize="small" />
          <span>{loading ? "Registering..." : "Register Member"}</span>
        </button>

      </div>
    </div>
  );
};

export default Addmembers;
