import React, { useState, useEffect } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import { getCurrentUser, logout } from "./utils/auth";
import "./styles/App.css";

function App() {
    const [currentUser, setCurrentUser] = useState(null);
    const [currentView, setCurrentView] = useState("login");

    useEffect(() => {
        const user = getCurrentUser();
        if (user) {
            setCurrentUser(user);
            setCurrentView("dashboard");
        }
    }, []);

    const handleLogin = (user) => {
        setCurrentUser(user);
        setCurrentView("dashboard");
    };

    const handleLogout = () => {
        logout();
        setCurrentUser(null);
        setCurrentView("login");
    };

    const switchView = (view) => {
        setCurrentView(view);
    };

    return (
        <div className="App">
            {currentView === "login" && (
                <Login onLogin={handleLogin} switchView={switchView} />
            )}
            {currentView === "register" && (
                <Register onRegister={handleLogin} switchView={switchView} />
            )}
            {currentView === "dashboard" && currentUser && (
                <Dashboard user={currentUser} onLogout={handleLogout} />
            )}
        </div>
    );
}

export default App;
