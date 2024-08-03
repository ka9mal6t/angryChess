import React, { useState, FC } from 'react';
import { sendRecoverLink } from '../../api/auth';
import ErrorComponent from '../elements/ErrorComponent'


interface ForgotProps {
  setIsSend: (a: boolean) => void;
  setLoading: (a: boolean) => void;
}

const ForgotForm: FC<ForgotProps> = ({setIsSend, setLoading}) => {
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');

  const [email, setEmail] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendRecoverLink({ email });
      setIsSend(true);
    } catch (error) {
      setLoading(false);
      setError(true);
      setErrorText('Email not found');
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

      {error && (
        <ErrorComponent
              isOpen={error}
              message={errorText}
              handleClose={() => {
                  setError(false);
              }}
              messageCancel={'Close'}
          />
      )}
      
      {error && <div className="overlay" />}
    </form>
  );
};

export default ForgotForm;
