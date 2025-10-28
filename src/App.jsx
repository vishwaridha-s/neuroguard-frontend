import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import PatientList from './components/PatientList';
import ProfilePage from './components/ProfilePage';
import ThemeSwitcher from './components/ThemeSwitcher';

import './styles/light.css';
import './styles/dark.css';

export const ThemeContext = React.createContext();

const getSystemTheme = () =>
  window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

export default function App() {
  const [theme, setTheme] = useState(getSystemTheme());
  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <Router>
        <ThemeSwitcher />
        <Routes>
          <Route path="/" element={<AuthForm />} />
          <Route path="/signup" element={<AuthForm signup />} />
          <Route path="/dashboard/:role/:id" element={<Dashboard />} />
          <Route path="/patients/:caregiverId" element={<PatientList />} />
          <Route path="/profile/:role/:id" element={<ProfilePage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeContext.Provider>
  );
}
