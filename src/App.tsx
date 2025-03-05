import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import ArticleDetail from "./pages/ArticleDetail";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";

const App: React.FC = () => {
    return (
        <Router>
            <Header /> {/* ✅ Add Header Here */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/article/:id" element={<ArticleDetail />} />
            </Routes>
            <Footer /> {/* ✅ Add Footer Here */}
        </Router>
    );
};

export default App;