import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Settings from './pages/Settings';
import ArticleDetail from './pages/ArticleDetail';
import { applyTheme, getPreferences, savePreferences } from './utils/preferences';

const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState(() => {
    const preferences = getPreferences();
    applyTheme(preferences.theme);
    return preferences.theme !== 'light';
  });

  useEffect(() => {
    const syncTheme = () => {
      const preferences = getPreferences();
      applyTheme(preferences.theme);
      setDarkMode(preferences.theme !== 'light');
    };

    syncTheme();
    window.addEventListener('newsNowPreferencesChanged', syncTheme);
    return () => window.removeEventListener('newsNowPreferencesChanged', syncTheme);
  }, []);

  const toggleDarkMode = () => {
    const preferences = getPreferences();
    const next = {
      ...preferences,
      theme: darkMode ? 'light' as const : 'signal' as const,
    };
    savePreferences(next);
    applyTheme(next.theme);
    setDarkMode(next.theme !== 'light');
    window.dispatchEvent(new Event('newsNowPreferencesChanged'));
  };

  return (
    <Router>
      <div className="min-h-screen bg-[var(--app-bg)] text-[var(--text)] transition-colors">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main className="min-h-[calc(100vh-168px)]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
