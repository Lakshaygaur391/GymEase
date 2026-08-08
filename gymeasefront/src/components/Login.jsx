import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/axiosInstance";
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const Login = ({ switchToRegister }) => {
  const [loginfield, setLoginfield] = useState({
    username: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handlelogin = async () => {
    setErrorMsg("");
    if (!loginfield.username || !loginfield.password) {
      setErrorMsg("Please fill in both username and password");
      return;
    }
    try {
      setLoading(true);
      const response = await API.post('/auth/login', {
        Username: loginfield.username,
        Password: loginfield.password,
      });

      if (response.data.success) {
        sessionStorage.setItem("islogin", "true");
        if (response.data.token) {
          sessionStorage.setItem("token", response.data.token);
        }
        if (response.data.gym) {
          sessionStorage.setItem("gym", JSON.stringify(response.data.gym));
        }
        navigate("/dashboard");
      } else {
        setErrorMsg(response.data.Message || "Login failed");
      }
    } catch (err) {
      console.error("Login Error:", err);
      setErrorMsg(err.response?.data?.Message || err.response?.data?.message || "Invalid credentials or server error");
    } finally {
      setLoading(false);
    }
  };

  const handleonchange = (event, name) => {
    setLoginfield({ ...loginfield, [name]: event.target.value });
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handlelogin();
    }
  };

  return (
    <div className="w-[92%] sm:w-[80%] md:w-[480px] glass-panel p-8 sm:p-10 rounded-3xl shadow-2xl shadow-indigo-500/10 border border-slate-700/60 relative">
      
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-white tracking-tight">
          Welcome Back
        </h2>
        <p className="text-sm text-slate-400 mt-2">
          Sign in to manage your fitness club
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-3 bg-red-500/15 border border-red-500/40 text-red-300 text-sm text-center rounded-xl flex items-center justify-center gap-2">
          <ErrorOutlineIcon fontSize="small" />
          <span>{errorMsg}</span>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Username
          </label>
          <div className="relative flex items-center">
            <PersonOutlineIcon className="absolute left-3.5 text-slate-400" fontSize="small" />
            <input
              value={loginfield.username}
              onChange={(event) => handleonchange(event, "username")}
              onKeyDown={handleKeyDown}
              type="text"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              placeholder="Enter your username"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Password
          </label>
          <div className="relative flex items-center">
            <LockOutlinedIcon className="absolute left-3.5 text-slate-400" fontSize="small" />
            <input
              value={loginfield.password}
              onChange={(event) => handleonchange(event, "password")}
              onKeyDown={handleKeyDown}
              type="password"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-slate-900/80 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          disabled={loading}
          onClick={handlelogin}
          className="w-full py-3.5 mt-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer transition transform active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="inline-block animate-pulse">Authenticating...</span>
          ) : (
            "Sign In to Dashboard"
          )}
        </button>
      </div>

      {/* Switch to Register */}
      <div className="text-center mt-8 pt-6 border-t border-slate-800 text-sm text-slate-400">
        Don’t have an account yet?{" "}
        <span
          onClick={switchToRegister}
          className="text-indigo-400 font-semibold cursor-pointer hover:underline hover:text-indigo-300 transition ml-1"
        >
          Register your Gym
        </span>
      </div>

    </div>
  );
};

export default Login;