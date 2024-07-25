import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import Cookies from 'js-cookie';
import { getInfo } from '../api/auth';
import axios from 'axios';
import '../pages/css/AuthContext.css'


interface AuthContextType {
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkTokenValidity = async () => {
      const token = Cookies.get('accessToken');
      if (token) {
        try {
          await getInfo(token); // Попытка получить никнейм пользователя
          setIsAuthenticated(true);
        } catch (error) {
          if (axios.isAxiosError(error)) {
            if (error.response?.status === 401) {
              Cookies.remove('accessToken');
            }
          }
          setIsAuthenticated(false);
        }
      }
      setLoading(false);
    };

    checkTokenValidity();
  }, []);

  const login = (token: string) => {
    setIsAuthenticated(true);
    Cookies.set('accessToken', token); // Сохраняем токен в куки
  };

  const logout = () => {
    setIsAuthenticated(false);
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
    </div>; // Отображаем загрузочный индикатор пока проверяем токен
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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