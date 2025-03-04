import React from "react";
import { Link } from "react-router-dom";
import "../App.css";

const Header: React.FC = () => {
    return (
        <header className="header">
            <nav>
                <Link to="/">🏠 Home</Link>
                <Link to="/settings">⚙ Settings</Link>
            </nav>
        </header>
    );
};

export default Header;