import React, { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    let valid = true;

    setEmailError('');
    setPasswordError('');
    setError('');

    if (!email) {
      setEmailError('Email is required.');
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Email is invalid.');
      valid = false;
    }

    if (!password) {
      setPasswordError('Password is required.');
      valid = false;
    }

    if (!valid) return;

    try {
      const response = await fetch('http://localhost:8080/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include' 
      });

      if (!response.ok) {
        throw new Error('Login failed');
      }

      const data = await response.json();
      
      localStorage.setItem('token', data.token);

      navigate('/home');

    } catch (error) {
      console.error(error.message);
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register');
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
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
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${emailError ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter a valid email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <p className="text-red-500 text-sm mt-2">{emailError}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black ${passwordError ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <p className="text-red-500 text-sm mt-2">{passwordError}</p>}
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

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

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
