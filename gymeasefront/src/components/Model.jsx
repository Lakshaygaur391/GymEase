import React from 'react';
import ClearIcon from '@mui/icons-material/Clear';

const Model = ({ handleclick, content, header }) => {
  return (
    <div className='fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex justify-center items-center p-4 overflow-y-auto'>
      <div className='bg-slate-900 border border-slate-700/60 w-full max-w-2xl rounded-3xl shadow-2xl shadow-indigo-950/40 text-slate-100 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200'>
        
        {/* Modal Header */}
        <div className='p-5 sm:p-6 border-b border-slate-800 flex justify-between items-center bg-slate-900/90'>
          <h3 className='font-extrabold text-xl sm:text-2xl text-white tracking-tight'>
            {header}
          </h3>
          <button 
            onClick={() => handleclick()} 
            className='p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer border border-slate-700/50'
          >
            <ClearIcon fontSize="small" />
          </button>
        </div>

        {/* Modal Body Content */}
        <div className='p-4 sm:p-6 max-h-[75vh] overflow-y-auto'>
          {content}
        </div>

      </div>
    </div>
  );
};

export default Model;
