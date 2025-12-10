'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdminLogin = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Check if already authenticated by making a simple request
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/admin/check-auth', {
          headers: {
            'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
          },
        });
        
        if (response.ok) {
          router.push('/admin');
        }
      } catch (err) {
        // If there's an error, stay on login page
      }
    };
    
    // Only run this if we have a saved credential
    const savedCredentials = localStorage.getItem('adminCredentials');
    if (savedCredentials) {
      const [user, pass] = atob(savedCredentials).split(':');
      setUsername(user);
      setPassword(pass);
      checkAuth();
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // We'll use the browser's built-in Basic Auth
      // The middleware will handle the verification
      const response = await fetch('/api/admin/check-auth', {
        headers: {
          'Authorization': `Basic ${btoa(`${username}:${password}`)}`,
        },
      });
      
      if (response.status === 401) {
        setError('Invalid credentials. Please try again.');
        return;
      }
      
      if (response.ok) {
        // Store credentials in localStorage (not ideal for security, but for simplicity)
        localStorage.setItem('adminCredentials', btoa(`${username}:${password}`));
        router.push('/admin');
      } else {
        setError('An error occurred. Please try again.');
      }
    } catch (err) {
      setError('Could not connect to the server. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-8 bg-card rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Admin Login</h1>
          <p className="text-muted-foreground mt-2">Enter your credentials to access the admin panel</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-destructive/10 text-destructive p-3 rounded-md">
              {error}
            </div>
          )}
          
          <div>
            <label htmlFor="username" className="block mb-2 font-medium">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="admin"
              required
            />
          </div>
          
          <div>
            <label htmlFor="password" className="block mb-2 font-medium">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="••••••••"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground p-3 rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;