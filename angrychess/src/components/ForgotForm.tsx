import React, { useState, FC } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendRecoverLink } from '../api/auth';
import Cookies from 'js-cookie';


interface ForgotProps {
  setIsSend: (a: boolean) => void;
}

const ForgotForm: FC<ForgotProps> = ({setIsSend}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const message  = await sendRecoverLink({ email });
      setIsSend(true);
    } catch (error) {
      setError('Email not found')
      console.error('Email not found', error);
    }
  };

  return (

    <form onSubmit={handleSubmit} className="forgot__form">
      <div className="forgot__label">
          <label>Enter your user account's verified email address.</label>
      </div>
      <div className="forgot__field">
          <input type="email" id="email" value={email}
          className="forgot__input"
          onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="forgot__button">
          <button type="submit" className="forgot__cfm-btn">Send password reset email</button>
      </div>
    </form>
  );
};

export default ForgotForm;
