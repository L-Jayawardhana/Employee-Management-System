import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log('Attempting login:', { email });
      
      // Call the actual backend login API
      const response = await fetch('http://localhost:8080/api/v1/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password
        }),
      });

      console.log('Login response status:', response.status);

      if (response.ok) {
        const authData = await response.json();
        console.log('Auth response data:', authData);
        
        // Extract token, role, and email from response
        const token = authData.token || authData.accessToken || authData.jwt;
        const userRole = authData.role;
        const userEmail = authData.email;
        
        if (token && userRole) {
          // Store authentication data in localStorage
          localStorage.setItem('authToken', token);
          localStorage.setItem('userRole', userRole);
          localStorage.setItem('userEmail', userEmail);
          
          console.log('Login successful. Role:', userRole);
          
          // Redirect based on the role from backend response
          switch (userRole.toUpperCase()) {
            case 'ADMIN':
              navigate('/admin-dashboard');
              break;
            case 'HR':
              navigate('/hr-dashboard');
              break;
            case 'USER':
              navigate('/user-dashboard');
              break;
            default:
              console.error('Unknown role:', userRole);
              setError('Unknown user role. Please contact administrator.');
          }
        } else {
          console.error('No token or role found in response:', authData);
          setError('Authentication failed. Invalid response from server.');
        }
      } else {
        // Handle authentication failure
        const errorData = await response.text();
        console.error('Login failed with status:', response.status, errorData);
        
        if (response.status === 401) {
          setError('Invalid email or password. Please check your credentials.');
        } else if (response.status === 403) {
          setError('Access denied. Your account may be disabled.');
        } else {
          setError('Login failed. Please try again later.');
        }
      }
    } catch (err) {
      console.error('Error during login:', err);
      setError('Network error. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <h1>Employee Management System</h1>
            <h2>Sign In</h2>
            <p>Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <button
              type="submit"
              className={`btn btn-primary login-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Don't have an account? 
              <button 
                type="button" 
                className="link-button"
                onClick={() => navigate('/')}
              >
                Contact Administrator
              </button>
            </p>
            <button 
              type="button" 
              className="link-button"
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
          </div>

          <div className="demo-accounts">
            <h3>Demo Accounts:</h3>
            <div className="demo-list">
              <p><strong>Admin:</strong> admin@company.com / admin123</p>
              <p><strong>HR:</strong> hr@company.com / hr123</p>
              <p><strong>User:</strong> user@company.com / user123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
