import React from 'react';
import '../../pages/css/ForgotMessage.css'



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
