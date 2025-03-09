import React from "react";
import "../App.css";

const Footer: React.FC = () => {
    return (
        <footer className="footer">
            <p>📢 NewScraper &copy; {new Date().getFullYear()} | By <span style={{ color: "skyblue" }}>EN1GMA</span></p>
        </footer>
    );
};

export default Footer;