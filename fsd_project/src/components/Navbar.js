import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react'; // Import Auth0 hook
import './navbar.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


function Navbar() {
    const location = useLocation(); // Get the current location
    const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0(); // Use Auth0 hook

    return (
        <nav className="navbar">
            <h1 className="navbar-title">Health App</h1>
            <div className="nav-links">
                {isAuthenticated && (
                    <>
                        <Link 
                            to="/form" 
                            className={`nav-link ${location.pathname === '/form' ? 'active' : ''}`}
                        >
                            Patient Form
                        </Link>
                        <Link 
                            to="/history" 
                            className={`nav-link ${location.pathname === '/history' ? 'active' : ''}`}
                        >
                            History
                        </Link>
                        <Link 
                            to="/visualization/:mobile" 
                            className={`nav-link ${location.pathname.startsWith('/visualization') ? 'active' : ''}`}
                        >
                            Visualization
                        </Link>
                    </>
                )}
            </div>

            <div className="auth-section">
                {isAuthenticated ? (
                    <>
                        <span className="user-email">{user.email}</span>
                        <button 
                            className="nav-button logout-button" 
                            onClick={() => logout({ returnTo: window.location.origin })}
                        >
                            <i className="bi bi-box-arrow-right"></i> {/* Bootstrap logout icon */}
                        </button>
                    </>
                ) : (
                    <button 
                        className="nav-button login-button" 
                        onClick={() => loginWithRedirect()}
                    >
                        <i className="bi bi-box-arrow-in-left"></i> {/* Bootstrap login icon */}
                    </button>
                )}
            </div>
        </nav>
    );
}

export default Navbar;
