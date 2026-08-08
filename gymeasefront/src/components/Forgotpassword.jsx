import React, { useState } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';
import API from '../utils/axiosInstance';
import KeyOutlinedIcon from '@mui/icons-material/KeyOutlined';

const Forgotpassword = () => {
  const [emailSubmit, setEmailSubmit] = useState(false);
  const [otpvalidate, setOtpvalidate] = useState(false);
  const [buttonval, setButtonval] = useState("Send Verification OTP");
  const [inputfield, setInputfield] = useState({ Email: "", OTP: "", New_Password: "" });
  const [passwordvisi, setPasswordvisi] = useState("password");
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setErrorMsg("");
    setSuccessMsg("");

    if (!emailSubmit) {
      if (!inputfield.Email) {
        setErrorMsg("Please enter your email");
        return;
      }
      try {
        setLoading(true);
        const res = await API.post('/auth/reset-password/sendotp', { email: inputfield.Email });
        if (res.data.success) {
          setEmailSubmit(true);
          setButtonval("Verify OTP Code");
          setSuccessMsg("OTP code sent to your registered email!");
        } else {
          setErrorMsg(res.data.Message || "Failed to send OTP");
        }
      } catch (err) {
        console.error(err);
        setErrorMsg(err.response?.data?.Message || err.response?.data?.message || "Gym email not found or error sending OTP");
      } finally {
        setLoading(false);
      }
    } else if (emailSubmit && !otpvalidate) {
      if (!inputfield.OTP) {
        setErrorMsg("Please enter the OTP");
        return;
      }
      try {
        setLoading(true);
        const res = await API.post('/auth/reset-password/verifyotp', {
          email: inputfield.Email,
          otp: inputfield.OTP
        });
        if (res.data.success) {
          setOtpvalidate(true);
          setButtonval("Save New Password");
          setSuccessMsg("OTP verified! Set your new password.");
        } else {
          setErrorMsg(res.data.Message || "Invalid OTP");
        }
      } catch (err) {
        console.error(err);
        setErrorMsg(err.response?.data?.Message || err.response?.data?.message || "Invalid or expired OTP");
      } finally {
        setLoading(false);
      }
    } else if (emailSubmit && otpvalidate) {
      if (!inputfield.New_Password) {
        setErrorMsg("Please enter a new password");
        return;
      }
      try {
        setLoading(true);
        const res = await API.post('/auth/reset-password/newpassword', {
          email: inputfield.Email,
          newPassword: inputfield.New_Password
        });
        if (res.data.success) {
          setSuccessMsg("Password reset successfully! You can now log in.");
          setButtonval("Password Reset Complete");
        } else {
          setErrorMsg(res.data.Message || "Password reset failed");
        }
      } catch (err) {
        console.error(err);
        setErrorMsg(err.response?.data?.Message || err.response?.data?.message || "Password reset failed");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleonchange = (event, name) => {
    setInputfield({ ...inputfield, [name]: event.target.value });
  };

  return (
    <div className='w-full p-2 text-slate-100'>
      {errorMsg && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500/40 text-red-300 text-xs text-center rounded-xl font-medium">
          {errorMsg}
        </div>
      )}
      {successMsg && (
        <div className="mb-4 p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center rounded-xl font-medium">
          {successMsg}
        </div>
      )}

      <div className='space-y-4'>
        <div>
          <label className='block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5'>
            Registered Email
          </label>
          <input
            disabled={emailSubmit}
            value={inputfield.Email}
            onChange={(event) => handleonchange(event, "Email")}
            type="text"
            placeholder='Enter gym email'
            className='w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm disabled:opacity-50'
          />
        </div>

        {emailSubmit && (
          <div>
            <label className='block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5'>
              6-Digit OTP Code
            </label>
            <input
              disabled={otpvalidate}
              value={inputfield.OTP}
              onChange={(event) => handleonchange(event, "OTP")}
              type="text"
              placeholder='Enter OTP received on email'
              className='w-full px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm disabled:opacity-50 tracking-widest text-center font-mono text-base'
            />
          </div>
        )}

        {otpvalidate && (
          <div>
            <label className='block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5'>
              New Password
            </label>
            <div className='relative flex items-center'>
              <input
                value={inputfield.New_Password}
                onChange={(event) => handleonchange(event, "New_Password")}
                type={passwordvisi}
                placeholder='Enter new password'
                className='w-full pl-4 pr-10 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 text-sm'
              />
              <VisibilityIcon
                className="absolute right-3 text-slate-400 cursor-pointer hover:text-white"
                fontSize="small"
                onMouseEnter={() => setPasswordvisi("text")}
                onMouseLeave={() => setPasswordvisi("password")}
              />
            </div>
          </div>
        )}

        <button
          disabled={loading}
          className='w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-indigo-600/30 cursor-pointer transition disabled:opacity-50 mt-4 text-sm flex items-center justify-center gap-2'
          onClick={handleSubmit}
        >
          <KeyOutlinedIcon fontSize="small" />
          <span>{loading ? "Processing..." : buttonval}</span>
        </button>
      </div>
    </div>
  );
};

export default Forgotpassword;