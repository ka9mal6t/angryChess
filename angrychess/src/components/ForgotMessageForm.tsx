import React, { useState, FC } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendRecoverLink } from '../api/auth';
import Cookies from 'js-cookie';
import '../pages/css/ForgotMessage.css'



const ForgotMessageForm: React.FC = () => {
    
  return (

    <form method="get" className="forgot__form">
        <div className="forgot__label">
            <label>We will send you a password reset link.</label>
        </div>
    </form>
    );
};

export default ForgotMessageForm;
