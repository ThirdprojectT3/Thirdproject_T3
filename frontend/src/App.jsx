import { Routes, Route } from 'react-router-dom';

import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ProfilePage from './pages/ProfilePage';
import GraphPage from './pages/GraphPage';

import PrivateRoute from './pages/PrivateRoute';

import './App.css';

function App() {
  return (
    <Routes>
      {/* 공개 라우트 */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* 보호된 라우트 */}
      <Route path="/main" element={<PrivateRoute><MainPage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="/graph" element={<PrivateRoute><GraphPage /></PrivateRoute>} />
    </Routes>
  );
}

export default App;
