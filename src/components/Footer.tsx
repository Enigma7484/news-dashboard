import React from "react";
import "../App.css";

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <p>📢 NewsScraper &copy; {new Date().getFullYear()} | Built with ❤️ by Omar</p>
        </footer>
    );
};

export default Footer;