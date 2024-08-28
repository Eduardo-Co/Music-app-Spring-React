import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      console.log('Login successful:', data);

    } catch (error) {
      setError(error.message);
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register'); 
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <section id="loginForm" className="p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <div className="text-center mb-6">
          <img 
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" 
            className="w-3/4 mx-auto"
            alt="Sample" 
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="text-center mb-6">
            <button type="button" className="bg-blue-600 text-white rounded-full p-2 mx-1 hover:bg-blue-700 transition">
              <i className="fab fa-facebook-f"></i>
            </button>

            <button type="button" className="bg-blue-400 text-white rounded-full p-2 mx-1 hover:bg-blue-500 transition">
              <i className="fab fa-twitter"></i>
            </button>

            <button type="button" className="bg-blue-700 text-white rounded-full p-2 mx-1 hover:bg-blue-800 transition">
              <i className="fab fa-linkedin-in"></i>
            </button>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="email">Email address</label>
            <input 
              type="email" 
              id="email" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter a valid email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <input 
                className="mr-2" 
                type="checkbox" 
                id="rememberMe" 
              />
              <label className="text-sm" htmlFor="rememberMe">
                Remember me
              </label>
            </div>
            <a href="#!" className="text-blue-500 text-sm hover:underline">Forgot password?</a>
          </div>

          <div className="text-center mt-6">
            <button 
              type="submit" 
              className="bg-blue-600 text-white rounded-lg px-4 py-2 text-lg font-semibold hover:bg-blue-700 transition"
            >
              Login
            </button>
            <p className="text-sm mt-4">
              Don't have an account? <span onClick={handleRegisterRedirect} className="text-red-500 hover:underline cursor-pointer">Register</span>
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Login;
