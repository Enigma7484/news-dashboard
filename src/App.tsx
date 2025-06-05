// src/App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Settings from './pages/Settings';
import ArticleDetail from './pages/ArticleDetail';

const App: React.FC = () => {
  // Keep darkMode state at top level so Header and Home/Settings share it
  const [darkMode, setDarkMode] = useState(
    () => localStorage.getItem('darkMode') === 'true'
  );

  // On initial mount, apply dark class if needed
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode((prev) => {
      const next = !prev;
      if (next) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('darkMode', String(next));
      return next;
    });
  };

  return (
    <Router>
      <div className="bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors">
        <Header darkMode={darkMode} toggleDarkMode={toggleDarkMode} />
        <main className="pt-4">
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/settings"
              element={<Settings />}
            />
            <Route
              path="/article/:id"
              element={<ArticleDetail />}
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};

export default App;