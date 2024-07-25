import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

const RegisterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [cnfrm_password, setCnfrm_password] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (password === cnfrm_password){
        await register({ username,email, password });
        navigate('/angryChess/login');
      }
      else{
        console.error('Passwords are different');
      }
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register__form">
      <div className="register__label">
          <label className="email">Email</label>
      </div>
      <div className="register__field">
          <input type="email" value={email} id="email" 
          className="register__input"
          onChange={(e) => setEmail(e.target.value)} required/>
      </div>
      <div className="register__label">
          <label>Username</label>
      </div>
      <div className="register__field">
          <input type="text" value={username} id="username" 
          className="register__input" 
          onChange={(e) => setUsername(e.target.value)} required/>
      </div>
      <div className="register__label">
          <label>Password</label>
      </div>
      <div className="register__field">
          <input type="password" value={password} id="password" 
          className="register__input"
          onChange={(e) => setPassword(e.target.value)} required/>
      </div>
      <div className="register__label">
          <label>Confirm Password</label>
      </div>
      <div className="register__field">
          <input type="password" value={cnfrm_password} id="cnfrm_password" 
          className="register__input"
          onChange={(e) => setCnfrm_password(e.target.value)} required/>
      </div>
      <div className="register__button">
          <button type="submit" className="register__cfm-btn">Sing Up</button>
      </div>
    </form>
  );
};

export default RegisterForm;
