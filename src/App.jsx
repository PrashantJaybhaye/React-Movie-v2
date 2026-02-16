import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { WatchlistProvider } from './context/WatchlistContext';
import Header from './components/Header';
import Home from './components/Home';
import MovieDetail from './components/MovieDetail';
import Profile from './components/Profile';
import Watchlist from './components/Watchlist';

const App = () => {
    return (
        <ToastProvider>
            <AuthProvider>
                <WatchlistProvider>
                    <Router>
                        <Header />
                        <main>
                            <div className="pattern" />
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/movie/:id" element={<MovieDetail />} />
                                <Route path="/profile" element={<Profile />} />
                                <Route path="/watchlist" element={<Watchlist />} />
                            </Routes>
                        </main>
                    </Router>
                </WatchlistProvider>
            </AuthProvider>
        </ToastProvider>
    );
};

export default App;