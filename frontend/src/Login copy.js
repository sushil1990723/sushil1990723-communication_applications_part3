import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginForm = () => {
  const [loginValue, setLoginValue] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginValue({
      ...loginValue,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorMessage = validate();
    if (errorMessage) {
      setError(errorMessage);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/login', loginValue, {
        withCredentials: true
      });

      
      if (response.data.success) {
        // Save logged-in user ID in localStorage
        
        localStorage.setItem('loggedInUserId', response.data.user.id);
        
        // Redirect to the LoginSuccessful page
        navigate('/LoginSuccessful');
      } else {
        setError(response.data.message || 'Invalid username or password');
      }
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || 'An error occurred during login. Please try again.');
      } else if (error.request) {
        setError('No response from server. Please check your connection and try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
    }
  };

  const validate = () => {
    if (!loginValue.email) {
      return "Email is required.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(loginValue.email)) {
      return "Please enter a valid email address.";
    }

    if (!loginValue.password) {
      return "Password is required.";
    }

    if (loginValue.password.length < 6) {
      return "Password must be at least 6 characters long.";
    }

    return null;
  };

  return (
    <div>
      <div className="container pt-5 col-6 mx-auto">
        <h1 className="text-center">Login</h1>

        <div className="container pt-5">
          <form onSubmit={handleSubmit}>
            <div className="mb-3 mt-3">
              <label htmlFor="email" className="form-label">Email:</label>
              <input
                type="text"
                className="form-control"
                id="loginEmail"
                placeholder="Enter email"
                name="email"
                value={loginValue.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="pwd" className="form-label">Password:</label>
              <input
                type="password"
                className="form-control"
                id="loginPassword"
                placeholder="Enter password"
                name="password"
                value={loginValue.password}
                onChange={handleChange}
              />
            </div>
            {error && <p className='errors text-danger'>{error}</p>}
            <button type="submit" className='btn btn-primary'>Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
