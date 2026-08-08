import React, { useState } from "react";
import Model from "./Model";
import Forgotpassword from "./Forgotpassword";
import axios from "axios";
import API from "../utils/axiosInstance";
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const Register = ({ switchToLogin }) => {
  const [forgotpass, setForgotpass] = useState(false);
  const [loaderimage, setLoaderimage] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleclick = () => {
    setForgotpass((prev) => !prev);
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
      console.log(response);
      setLoaderimage(false);

      setLoginfield((prev) => ({
        ...prev,
        profilepic: response.data.secure_url,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoaderimage(false);
    }
  };

  const [loginfield, setLoginfield] = useState({
    Email: "",
    Gym_Name: "",
    UserName: "",
    Password: "",
    profilepic: "https://png.pngtree.com/png-clipart/20200224/original/pngtree-avatar-icon-profile-icon-member-login-vector-isolated-png-image_5247852.jpg",
  });

  const handleonchange = (event, name) => {
    if (name === "profilepic") {
      setLoginfield({ ...loginfield, profilepic: event.target.files[0] });
    } else {
      setLoginfield({ ...loginfield, [name]: event.target.value });
    }
  };

  const handleRegister = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    if (!loginfield.Email || !loginfield.Gym_Name || !loginfield.UserName || !loginfield.Password) {
      setErrorMsg("All required fields must be filled");
      return;
    }

    try {
      setLoading(true);
      const res = await API.post('/auth/register', {
        email: loginfield.Email,
        Gym_Name: loginfield.Gym_Name,
        Username: loginfield.UserName,
        Password: loginfield.Password,
        Profilepic: loginfield.profilepic,
      });

      if (res.status === 201 || res.data.Message) {
        setSuccessMsg("Gym registered successfully! Redirecting to login...");
        setTimeout(() => {
          switchToLogin();
        }, 1500);
      }
    } catch (err) {
      console.error("Register Error:", err);
      setErrorMsg(err.response?.data?.Message || err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-[92%] sm:w-[85%] md:w-[480px] glass-panel p-6 sm:p-8 rounded-3xl shadow-2xl shadow-indigo-500/10 border border-slate-700/60 overflow-y-auto max-h-[88vh]">

      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Register Your Gym
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Create an admin account for your fitness center
        </p>
      </div>

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

      <div className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Email Address
          </label>
          <div className="relative flex items-center">
            <EmailOutlinedIcon className="absolute left-3.5 text-slate-400" fontSize="small" />
            <input
              value={loginfield.Email}
              type="email"
              onChange={(e) => handleonchange(e, "Email")}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
              placeholder="admin@fitnessclub.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Gym Name
          </label>
          <div className="relative flex items-center">
            <BusinessOutlinedIcon className="absolute left-3.5 text-slate-400" fontSize="small" />
            <input
              value={loginfield.Gym_Name}
              type="text"
              onChange={(e) => handleonchange(e, "Gym_Name")}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
              placeholder="e.g. Metro Fitness Club"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Username
          </label>
          <div className="relative flex items-center">
            <PersonOutlineIcon className="absolute left-3.5 text-slate-400" fontSize="small" />
            <input
              value={loginfield.UserName}
              type="text"
              onChange={(e) => handleonchange(e, "UserName")}  
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
              placeholder="Choose username"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Password
          </label>
          <div className="relative flex items-center">
            <LockOutlinedIcon className="absolute left-3.5 text-slate-400" fontSize="small" />
            <input
              value={loginfield.Password}
              type="password"
              onChange={(e) => handleonchange(e, "Password")}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-sm transition"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
            Gym Profile Photo
          </label>
          <label className="flex items-center justify-center gap-2 p-3 bg-slate-900/80 border border-dashed border-slate-700 rounded-xl cursor-pointer hover:border-indigo-500 transition text-slate-400 hover:text-white text-xs">
            <CloudUploadOutlinedIcon fontSize="small" />
            <span>Upload Logo / Banner</span>
            <input type="file" onChange={(e) => uploadimage(e)} className="hidden" />
          </label>
        </div>

        {loaderimage && (
          <Stack sx={{ width: '100%', color: 'grey.500' }} spacing={1}>
            <LinearProgress color="secondary" />
          </Stack>
        )}

        {loginfield.profilepic && (
          <div className="flex justify-center my-2">
            <div className="relative w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr from-indigo-500 to-emerald-400 shadow-md">
              <img
                src={loginfield.profilepic}
                alt="Profile Preview"
                className="w-full h-full rounded-full object-cover"
              />
            </div>
          </div>
        )}

        {/* Register Button */}
        <button
          disabled={loading}
          onClick={handleRegister}
          className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 cursor-pointer transition transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="inline-block animate-pulse">Registering Gym...</span>
          ) : (
            "Complete Registration"
          )}
        </button>
      </div>

      <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-800 text-xs">
        <span
          className="text-indigo-400 cursor-pointer hover:underline"
          onClick={handleclick}
        >
          Forgot Password?
        </span>
        <div className="text-slate-400">
          Already registered?{" "}
          <span
            onClick={switchToLogin}
            className="text-indigo-400 font-semibold cursor-pointer hover:underline ml-1"
          >
            Login
          </span>
        </div>
      </div>

      {/* Modal */}
      {forgotpass && (
        <Model
          handleclick={handleclick}
          content={<Forgotpassword />}
          header={"Reset Password"}
        />
      )}
    </div>
  );
};

export default Register;