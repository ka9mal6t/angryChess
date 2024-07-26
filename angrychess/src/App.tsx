import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import StatsPage from './pages/StatsPage';
import ForgotPage from './pages/ForgotPage';
import ChangePassPage from './pages/ChangePassPage';
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage';
import GameOnDevicePage from './pages/GameOnDevicePage'
import GameOnlinePage from './pages/GameOnlinePage'
import GameWatchPage from './pages/GameWatchPage'


const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router >
        <Routes>
          <Route path="/angryChess" element={<ProtectedRoute component={HomePage} />} />
          <Route path="/angryChess/login" element={<LoginPage />} />
          <Route path="/angryChess/register" element={<RegisterPage />} />

          <Route path="/angryChess/statistics/:user_id" element={<ProtectedRoute component={StatsPage} />} />
          <Route path="/angryChess/match/:match_id" element={<ProtectedRoute component={GameWatchPage} />} />
          
          <Route path='/angryChess/forgotPassword/changePassword/:token' element={<ChangePassPage />}/>
          <Route path="/angryChess/forgotPassword" element={<ForgotPage />} />
          
          <Route path="/angryChess/playOnOneDevice" element={<ProtectedRoute component={GameOnDevicePage} />} />
          <Route path="/angryChess/playRating" element={<ProtectedRoute component={GameOnlinePage} />} />
          <Route path="/angryChess/*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
