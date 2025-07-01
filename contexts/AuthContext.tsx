'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

interface User {
    id: string;
    email: string;
    name: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<boolean>;
    signup: (name: string, email: string, password: string) => Promise<boolean>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const storedUser = localStorage.getItem('taskapp_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if user exists in localStorage
        const users = JSON.parse(localStorage.getItem('taskapp_users') || '[]');
        const foundUser = users.find((u: any) => u.email === email && u.password === password);

        if (foundUser) {
            const userData = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
            setUser(userData);
            localStorage.setItem('taskapp_user', JSON.stringify(userData));
            setIsLoading(false);
            return true;
        }

        setIsLoading(false);
        return false;
    };

    const signup = async (name: string, email: string, password: string): Promise<boolean> => {
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Check if user already exists
        const users = JSON.parse(localStorage.getItem('taskapp_users') || '[]');
        const existingUser = users.find((u: any) => u.email === email);

        if (existingUser) {
            setIsLoading(false);
            return false;
        }

        // Create new user
        const newUser = {
            id: Math.random().toString(36).substr(2, 9),
            name,
            email,
            password
        };

        users.push(newUser);
        localStorage.setItem('taskapp_users', JSON.stringify(users));

        const userData = { id: newUser.id, email: newUser.email, name: newUser.name };
        setUser(userData);
        localStorage.setItem('taskapp_user', JSON.stringify(userData));

        setIsLoading(false);
        return true;
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('taskapp_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, signup, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}