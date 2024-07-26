import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
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
import GameWatchOnlinePage from './pages/GameWatchOnlinePage'



const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router basename="/angryChess">
        <Routes>
          <Route path="/" element={<ProtectedRoute component={HomePage} />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          <Route path="/statistics/:user_id" element={<ProtectedRoute component={StatsPage} />} />
          <Route path="/match/:match_id" element={<ProtectedRoute component={GameWatchPage} />} />
          <Route path="/matchOnline/:match_id" element={<ProtectedRoute component={GameWatchOnlinePage} />} />
          
          <Route path='/forgotPassword/changePassword/:token' element={<ChangePassPage />}/>
          <Route path="/forgotPassword" element={<ForgotPage />} />
          
          <Route path="/playOnOneDevice" element={<ProtectedRoute component={GameOnDevicePage} />} />
          <Route path="/playRating" element={<ProtectedRoute component={GameOnlinePage} />} />
          <Route path='/*' element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
