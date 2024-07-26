import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/auth';
import Cookies from 'js-cookie';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { accessToken } = await login({ username, password });
      setAuth(accessToken); 
      navigate('/angryChess/');
    } catch (error) {
      setError('Login failed')
      console.error('Login failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login__form">
        <div className="login__label">
            <label>Username</label>
        </div>
        <div className="login__field">
            <input type="text" id="email" value={username} className="login__input" onChange={(e) => setUsername(e.target.value)} required/>
        </div>
        <div className="login__label">
            <label>Password</label>
            <Link to="/angryChess/forgotPassword" className="login__link">Forgot password?</Link>
        </div>
        <div className="login__field">
            <input type="password" id="password" value={password} className="login__input" onChange={(e) => setPassword(e.target.value)} required/>
        </div>
        <div className="login__button">
            <button type="submit" className="login__cfm-btn">Login</button>
        </div>
    </form>    
  );
};

export default LoginForm;