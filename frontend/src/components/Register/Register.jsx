import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Register.css';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [usernameError, setUsernameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    setUsernameError('');
    setEmailError('');
    setPasswordError('');
    setConfirmPasswordError('');
    setGeneralError('');

    

    try {
      const response = await fetch('http://localhost:8080/user/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password , role: 'User'}),
      });

      
      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        if (errorData.username) setUsernameError(errorData.username);
        if (errorData.email) setEmailError(errorData.email);
        if (errorData.password) setPasswordError(errorData.password);
        if (password !== confirmPassword) setConfirmPasswordError("Passwords do not match");
        if(errorData.errorAlreadyExists) setGeneralError(errorData.errorAlreadyExists);
        
        return;
      }

      const data = await response.json();
      navigate('/login');

    } catch (error) {
      setGeneralError('Registration failed. Please try again later.');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <section id="registerForm" className="p-8 rounded-lg shadow-lg max-w-2xl w-full">
        <div className="text-center mb-6">
          <img 
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" 
            className="w-3/4 mx-auto"
            alt="Sample" 
          />
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="username">Username</label>
            <input 
              type="text" 
              id="username" 
              className={`w-full px-3 py-2 border ${usernameError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
              placeholder="Enter your username" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            {usernameError && <div className="text-red-500 text-sm mt-1">{usernameError}</div>}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="email">Email address</label>
            <input 
              type="email" 
              id="email" 
              className={`w-full px-3 py-2 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
              placeholder="Enter a valid email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {emailError && <div className="text-red-500 text-sm mt-1">{emailError}</div>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              className={`w-full px-3 py-2 border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
              placeholder="Enter password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {passwordError && <div className="text-red-500 text-sm mt-1">{passwordError}</div>}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2" htmlFor="confirmPassword">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword" 
              className={`w-full px-3 py-2 border ${confirmPasswordError ? 'border-red-500' : 'border-gray-300'} rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black`}
              placeholder="Confirm your password" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPasswordError && <div className="text-red-500 text-sm mt-1">{confirmPasswordError}</div>}
          </div>

          {generalError && <div className="text-red-500 mb-4">{generalError}</div>}

          <div className="text-center mt-6">
            <button 
              type="submit" 
              className="bg-blue-600 text-white rounded-lg px-4 py-2 text-lg font-semibold hover:bg-blue-700 transition"
            >
              Register
            </button>
            <p className="text-sm mt-4">
              Already have an account? <span onClick={handleLoginRedirect} className="text-red-500 hover:underline cursor-pointer">Login</span>
            </p>
          </div>
        </form>
      </section>
    </div>
  );
}

export default Register;
