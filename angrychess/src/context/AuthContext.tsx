import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getInfo, StatisticResponces, login as login__request } from '../api/auth';
import axios from 'axios';

import '../pages/css/AuthContext.css'


interface AuthContextType {
  isAuthenticated: boolean;
  user: StatisticResponces | null;
  login: (username: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<StatisticResponces | null>(null);

  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = Cookies.get('accessToken');
      if (token) {
        try {
          const userInfo = await getInfo(token); 

          setIsAuthenticated(true);
          setUser(userInfo);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
              Cookies.remove('accessToken');
            }
          }
          setIsAuthenticated(false);
          setUser(null);
        }
      }
      setLoading(false);
    };

    checkTokenValidity();
  }, []);

  const login  = (username: string, password: string) => {
    login__request({ username, password })
      .then(({ accessToken }) => {
        setIsAuthenticated(true);
        Cookies.set('accessToken', accessToken);
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
};

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    Cookies.remove('accessToken'); // Удаляем токен из куки
  };

  if (loading) {
    return <div className='modal open'>
      <div className="modal-content">
        <div className="loader" id="loader-4">
              <span></span>
              <span></span>
              <span></span>
            </div>
        </div>
    </div>;
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};