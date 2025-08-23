import React, { useState, useEffect } from 'react';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';

type AuthView = 'login' | 'register';

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [authView, setAuthView] = useState<AuthView>('login');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is already logged in
        const storedToken = localStorage.getItem('auth_token');
        const storedUser = localStorage.getItem('auth_user');

        if (storedToken && storedUser) {
            try {
                const parsedUser = JSON.parse(storedUser);
                setToken(storedToken);
                setUser(parsedUser);
                
                // Verify token is still valid
                fetch('/api/auth/user', {
                    headers: {
                        'Authorization': `Bearer ${storedToken}`,
                        'Accept': 'application/json'
                    }
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Token invalid');
                    }
                    return response.json();
                })
                .then(data => {
                    if (data.success) {
                        setUser(data.user);
                    } else {
                        handleLogout();
                    }
                })
                .catch(() => {
                    handleLogout();
                })
                .finally(() => {
                    setLoading(false);
                });
            } catch (error) {
                handleLogout();
                setLoading(false);
            }
        } else {
            setLoading(false);
        }
    }, []);

    const handleLogin = (userData: User, userToken: string) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('auth_token', userToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));
    };

    const handleRegister = (userData: User, userToken: string) => {
        setUser(userData);
        setToken(userToken);
        localStorage.setItem('auth_token', userToken);
        localStorage.setItem('auth_user', JSON.stringify(userData));
    };

    const handleLogout = () => {
        setUser(null);
        setToken(null);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (user && token) {
        return <Dashboard user={user} token={token} onLogout={handleLogout} />;
    }

    if (authView === 'register') {
        return (
            <Register
                onRegister={handleRegister}
                onSwitchToLogin={() => setAuthView('login')}
            />
        );
    }

    return (
        <Login
            onLogin={handleLogin}
        />
    );
};

export default App;
