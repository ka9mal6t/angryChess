import React, { useState, FC } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { changePassword } from '../api/auth';
import Cookies from 'js-cookie';

interface ChangePassProps {
    token: string | undefined;
}

const ChangePassForm: FC<ChangePassProps> = ({token}) => {

  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response  = await changePassword(token, newPassword);
      navigate('/');
    } catch (error) {
      setError('Time error')
      console.error('Time error', error);
    }
  };

  return (
        <form onSubmit={handleSubmit} className="forgot__form">
            <div className="forgot__title_label">
                <label>Change your password.</label>
            </div>
            <div className="forgot__label">
                <label>New password</label>
            </div>
            <div className="forgot__field">
                <input type="password" id="pass" value={newPassword}
                className="forgot__input"
                onChange={(e) => setNewPassword(e.target.value)} required/>
            </div>
            <div className="forgot__button">
                <button type="submit" className="forgot__cfm-btn">Change password</button>
            </div>
        </form>    
  );
};

export default ChangePassForm;
