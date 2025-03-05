import React, { useState, useEffect } from "react";
import "../App.css";

const Settings: React.FC = () => {
    const [defaultSentiment, setDefaultSentiment] = useState(() => {
        return localStorage.getItem("defaultSentiment") || "all";
    });

    const [defaultSort, setDefaultSort] = useState(() => {
        return localStorage.getItem("defaultSort") || "newest";
    });

    const [darkMode, setDarkMode] = useState(() => {
        return localStorage.getItem("darkMode") === "true";
    });

    useEffect(() => {
        localStorage.setItem("defaultSentiment", defaultSentiment);
    }, [defaultSentiment]);

    useEffect(() => {
        localStorage.setItem("defaultSort", defaultSort);
    }, [defaultSort]);

    useEffect(() => {
        localStorage.setItem("darkMode", String(darkMode));
        if (darkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, [darkMode]);

    return (
        <div className="container">
            <h2>Settings</h2>

            {/* Dark Mode Toggle */}
            <label className="settings-option">
                <span>Dark Mode</span>
                <input
                    type="checkbox"
                    checked={darkMode}
                    onChange={() => setDarkMode(!darkMode)}
                />
            </label>

            {/* Default Sentiment Filter */}
            <label className="settings-option">
                <span>Default Sentiment Filter</span>
                <select
                    value={defaultSentiment}
                    onChange={(e) => setDefaultSentiment(e.target.value)}
                >
                    <option value="all">All</option>
                    <option value="positive">Positive</option>
                    <option value="neutral">Neutral</option>
                    <option value="negative">Negative</option>
                </select>
            </label>

            {/* Default Sorting Order */}
            <label className="settings-option">
                <span>Default Sorting</span>
                <select
                    value={defaultSort}
                    onChange={(e) => setDefaultSort(e.target.value)}
                >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                </select>
            </label>
        </div>
    );
};

export default Settings;