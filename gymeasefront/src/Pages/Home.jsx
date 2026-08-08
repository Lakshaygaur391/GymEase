import React, { useState } from 'react';
import Login from '../components/Login';
import Register from '../components/Register';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

export const Home = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className='w-full min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between relative overflow-hidden'>
      {/* Background Lighting Effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-600/15 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Navbar */}
      <header className='w-full px-6 py-4 border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md flex justify-between items-center z-10'>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-emerald-400 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <FitnessCenterIcon className="text-white transform -rotate-45" />
          </div>
          <div>
            <h1 className="font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
              GYM<span className="text-emerald-400">EASE</span>
            </h1>
            <p className="text-xs text-slate-400 hidden sm:block">Smart Fitness Club Management Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700/60">
          <button
            onClick={() => setIsLogin(true)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition duration-200 ${
              isLogin ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition duration-200 ${
              !isLogin ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Register
          </button>
        </div>
      </header>

      {/* Main Content Body */}
      <main className='w-full flex-1 flex justify-center items-center p-4 relative z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900/60 via-slate-950 to-slate-950'>
        <div className='w-full flex flex-col items-center justify-center py-6'>
          {isLogin ? (
            <Login switchToRegister={() => setIsLogin(false)} />
          ) : (
            <Register switchToLogin={() => setIsLogin(true)} />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center py-3 text-xs text-slate-500 border-t border-slate-800/40 bg-slate-950/80 z-10">
        © {new Date().getFullYear()} GymEase. All rights reserved. Premium Gym Management System.
      </footer>
    </div>
  );
};
