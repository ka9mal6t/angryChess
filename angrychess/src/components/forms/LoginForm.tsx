import React, { useState, FC } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ErrorComponent from '../elements/ErrorComponent'
import { login } from '../../api/auth';

interface ILoginComponent{
  setLoading: (a: boolean) => void;
}
const LoginForm: FC<ILoginComponent> = ({setLoading}) => {
  const [error, setError] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login: setAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { accessToken } = await login({ username, password });
      setAuth(accessToken); 
      navigate('/');
    } catch (error) {
      setLoading(false);
      setError(true);
      setErrorText('Not correct data');
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
            <Link to="/forgotPassword" className="login__link">Forgot password?</Link>
        </div>
        <div className="login__field">
            <input type="password" id="password" value={password} className="login__input" onChange={(e) => setPassword(e.target.value)} required/>
        </div>
        <div className="login__button">
            <button type="submit" className="login__cfm-btn">Login</button>
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

export default LoginForm;
