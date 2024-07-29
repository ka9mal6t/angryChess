import React, { useState, FC } from 'react';
import {useNavigate} from 'react-router-dom';
import { changePassword } from '../../api/auth';

interface ChangePassProps {
    token: string | undefined;
}

const ChangePassForm: FC<ChangePassProps> = ({token}) => {

  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response  = await changePassword(token, newPassword);
      navigate('/');
    } catch (error) {
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
