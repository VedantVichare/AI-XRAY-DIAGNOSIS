import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Navbar from './components/Navbar'; // Navbar
import Form from './components/form'; // Patient Form
import History from './components/History'; // History
import Visualization from './components/Visualization'; // Visualization
import { useAuth0 } from '@auth0/auth0-react'; // Import Auth0 hook

function App() {
    const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0();

    // If Auth0 is still loading, show loading screen
    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <Router>
            <div className="app-container">
                <Navbar />
                <Switch>
                    {!isAuthenticated ? (
                        // Show login button if not authenticated
                        <div className="login-message">
                            <h2>Please log in to access the app</h2>
                            <button onClick={() => loginWithRedirect()} className="login-button">
                                Log In
                            </button>
                        </div>
                    ) : (
                        // Authenticated routes
                        <>
                            {/* Route to patient form */}
                            <Route path="/form" component={Form} />

                            {/* Route to history */}
                            <Route path="/history" component={History} />

                            {/* Dynamic route for visualization with mobile number */}
                            <Route 
                                path="/visualization" component={Visualization}
                                // render={(props) => <Visualization mobile={props.match.params.mobile} />} 
                            />

                            {/* Default route, redirect to form */}
                            <Route path="/" component={Form} exact />
                        </>
                    )}
                </Switch>
            </div>
        </Router>
    );
}

export default App;
