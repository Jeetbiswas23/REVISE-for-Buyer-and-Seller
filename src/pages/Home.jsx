import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = sessionStorage.getItem('currentUser');
    if (userStr) {
      navigate('/dashboard');
    } else {
      navigate('/signin');
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <p className="text-gray-500 text-sm tracking-widest uppercase">Redirecting...</p>
    </div>
  );
};

export default Home;
