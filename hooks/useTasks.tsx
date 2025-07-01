'use client';

import { useState, useEffect } from 'react';
import { Task, TaskFormData } from '@/types/task';
import { useAuth } from '@/contexts/AuthContext';

export function useTasks() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            loadTasks();
        }
    }, [user]);

    const loadTasks = () => {
        if (!user) return;

        const userTasks = localStorage.getItem(`tasks_${user.id}`);
        if (userTasks) {
            const parsedTasks = JSON.parse(userTasks).map((task: any) => ({
                ...task,
                createdAt: new Date(task.createdAt),
                completedAt: task.completedAt ? new Date(task.completedAt) : undefined
            }));
            setTasks(parsedTasks);
        }
        setIsLoading(false);
    };

    const saveTasks = (updatedTasks: Task[]) => {
        if (!user) return;

        localStorage.setItem(`tasks_${user.id}`, JSON.stringify(updatedTasks));
        setTasks(updatedTasks);
    };

    const addTask = (taskData: TaskFormData) => {
        const newTask: Task = {
            id: Math.random().toString(36).substr(2, 9),
            ...taskData,
            completed: false,
            createdAt: new Date()
        };

        const updatedTasks = [...tasks, newTask];
        saveTasks(updatedTasks);
    };

    const updateTask = (id: string, updates: Partial<Task>) => {
        const updatedTasks = tasks.map(task =>
            task.id === id ? { ...task, ...updates } : task
        );
        saveTasks(updatedTasks);
    };

    const deleteTask = (id: string) => {
        const updatedTasks = tasks.filter(task => task.id !== id);
        saveTasks(updatedTasks);
    };

    const toggleTask = (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const updates: Partial<Task> = {
            completed: !task.completed,
            completedAt: !task.completed ? new Date() : undefined
        };

        updateTask(id, updates);
    };

    return {
        tasks,
        isLoading,
        addTask,
        updateTask,
        deleteTask,
        toggleTask
    };
}