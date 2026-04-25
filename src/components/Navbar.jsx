import React from 'react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = ({ user, onLogout, showNewRFQ = false }) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between px-10 py-5 border-b border-gray-800 bg-black">
      <div className="flex items-center gap-6">
        {/* Logo */}
        <Link to="/dashboard" className="flex items-center gap-4 hover:opacity-80 transition-opacity">
          <div className="bg-white text-black w-12 h-12 flex items-center justify-center font-bold text-lg rounded-sm">
            R
          </div>
          <div>
            <p className="font-bold text-white text-xl leading-tight tracking-wide">REVERSE</p>
            <p className="text-xs text-gray-500 leading-tight tracking-[0.2em] mt-0.5">AUCTION OS</p>
          </div>
        </Link>

        {/* Nav Buttons — with gap between them */}
        <div className="flex items-center gap-4 ml-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-gray-900 rounded-lg border border-gray-800 text-sm font-medium text-white hover:bg-gray-800 transition-colors tracking-wide"
          >
            Dashboard
          </button>

          {showNewRFQ && user?.role === 'buyer' && (
            <button
              onClick={() => navigate('/create-rfq')}
              className="px-6 py-3 bg-white rounded-lg text-black text-sm font-bold hover:bg-gray-200 transition-colors tracking-wide"
            >
              + New RFQ
            </button>
          )}
        </div>
      </div>

      {/* User Info */}
      <div className="flex items-center gap-6">
        {user && (
          <>
            <div className="text-right">
              <p className="text-white text-base font-semibold">{user.fullName}</p>
              <p className="text-gray-400 text-xs uppercase tracking-[0.15em] mt-1">
                {user.role} · {user.company}
              </p>
            </div>
            <button
              onClick={onLogout}
              className="px-5 py-2.5 text-xs rounded-lg border border-gray-800 text-gray-400 hover:text-white hover:border-gray-600 transition-colors tracking-widest uppercase font-medium"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Navbar;
