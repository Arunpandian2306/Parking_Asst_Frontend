import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import backgroundImage from './assets/background.png';
import '@fortawesome/fontawesome-free/css/all.css';
import CarList from './CarsLandingPage'; // Import the CarList component

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/login`,{
        username,
        password
      });

      if (response.data.accessToken && response.data.refreshToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
        localStorage.setItem('refreshToken', response.data.refreshToken);
        setIsLoggedIn(true);
        setSuccess('Login successful!');
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 422) {
          setError('Invalid username or password');
        } else {
          setError('An error occurred. Please try again.');
        }
      }
    }
  };

  return (
    <div className="background" style={{ backgroundImage: `url(${backgroundImage})` }}>
      {!isLoggedIn ? (
        <div className="login-container">
          <h2>Login to Your Parking Asst.</h2>
          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}
          <form onSubmit={handleSubmit}>
            <div>
              <label className="label">Username:</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="input"
              />
            </div>
            <div>
              <label className="label">Password:</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input"
                />
                <i
                  className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'} eye-icon`}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </div>
            </div>
            <button type="submit" className="button">Login</button>
          </form>
        </div>
      ) : (
        <CarList /> // Show the CarList component after successful login
      )}
    </div>
  );
};

export default App;
