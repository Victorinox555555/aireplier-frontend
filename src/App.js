import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'https://aireplier-backend.railway.app';

function App() {
  const [status, setStatus] = useState('loading');
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const response = await axios.get(`${API_URL}/api/user`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUser(response.data);
        setStatus('authenticated');
      } else {
        setStatus('unauthenticated');
      }
    } catch (error) {
      setStatus('unauthenticated');
    }
  };

  const handleAuth = async (e) => {
    e.preventDefault();
    try {
      const endpoint = isLogin ? '/api/login' : '/api/register';
      const response = await axios.post(`${API_URL}${endpoint}`, {
        email,
        password
      });
      
      localStorage.setItem('token', response.data.token);
      setUser(response.data.user);
      setStatus('authenticated');
    } catch (error) {
      alert('Authentication failed');
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setStatus('unauthenticated');
  };

  if (status === 'loading') {
    return <div className="container">Loading...</div>;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="container">
        <div className="auth-container">
          <h1>🤖 AIReplier</h1>
          <h2>AI-Powered Email Automation</h2>
          <form onSubmit={handleAuth}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button type="submit">
              {isLogin ? 'Login' : 'Register'}
            </button>
          </form>
          <p>
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Register' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <header>
        <h1>🤖 AIReplier Dashboard</h1>
        <div>
          <span>Welcome, {user?.email}</span>
          <button onClick={logout}>Logout</button>
        </div>
      </header>
      
      <main>
        <div className="dashboard">
          <h2>💰 Start Earning with AI Email Automation!</h2>
          <div className="features">
            <div className="feature">
              <h3>📧 Smart Email Replies</h3>
              <p>AI-powered email responses</p>
            </div>
            <div className="feature">
              <h3>🔄 Automation</h3>
              <p>24/7 email management</p>
            </div>
            <div className="feature">
              <h3>💎 Premium Features</h3>
              <p>Advanced AI capabilities</p>
            </div>
          </div>
          
          <div className="cta">
            <h3>🚀 Ready to Automate Your Emails?</h3>
            <p>Subscribe now and start earning!</p>
            <button className="subscribe-btn">
              💰 Subscribe for $29/month
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
