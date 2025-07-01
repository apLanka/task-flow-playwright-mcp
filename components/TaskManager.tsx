'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TaskCard } from './TaskCard';
import { TaskForm } from './TaskForm';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/contexts/AuthContext';
import { Task, TaskFormData } from '@/types/task';
import { Plus, Search, Filter, CheckCircle, Clock, AlertTriangle, LogOut } from 'lucide-react';

export function TaskManager() {
    const { user, logout } = useAuth();
    const { tasks, isLoading, addTask, updateTask, deleteTask, toggleTask } = useTasks();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('all');
    const [filterPriority, setFilterPriority] = useState<'all' | 'low' | 'medium' | 'high'>('all');

    const filteredTasks = tasks.filter(task => {
        const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' ||
            (filterStatus === 'completed' && task.completed) ||
            (filterStatus === 'pending' && !task.completed);
        const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;

        return matchesSearch && matchesStatus && matchesPriority;
    });

    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = tasks.filter(task => !task.completed).length;
    const highPriorityTasks = tasks.filter(task => task.priority === 'high' && !task.completed).length;

    const handleFormSubmit = (data: TaskFormData) => {
        if (editingTask) {
            updateTask(editingTask.id, data);
            setEditingTask(null);
        } else {
            addTask(data);
        }
    };

    const handleEdit = (task: Task) => {
        setEditingTask(task);
        setIsFormOpen(true);
    };

    const handleCloseForm = () => {
        setIsFormOpen(false);
        setEditingTask(null);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your tasks...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
            {/* Header */}
            <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                TaskFlow
                            </h1>
                            <div className="hidden sm:flex items-center gap-2 text-sm text-gray-600">
                                <span>Welcome back,</span>
                                <span className="font-medium">{user?.name}</span>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            onClick={logout}
                            className="flex items-center gap-2 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        >
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                Completed
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                <Clock className="h-4 w-4 text-blue-600" />
                                Pending
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-600">{pendingTasks}</div>
                        </CardContent>
                    </Card>

                    <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-gray-600 flex items-center gap-2">
                                <AlertTriangle className="h-4 w-4 text-red-600" />
                                High Priority
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">{highPriorityTasks}</div>
                        </CardContent>
                    </Card>
                </div>

                {/* Controls */}
                <div className="bg-white/60 backdrop-blur-sm rounded-lg p-6 mb-6 border-0 shadow-sm">
                    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                        <div className="flex flex-col sm:flex-row gap-4 flex-1">
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search tasks..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 h-10"
                                />
                            </div>

                            <div className="flex gap-2">
                                <Select value={filterStatus} onValueChange={(value: any) => setFilterStatus(value)}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Tasks</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={filterPriority} onValueChange={(value: any) => setFilterPriority(value)}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Priority</SelectItem>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <Button
                            onClick={() => setIsFormOpen(true)}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4" />
                            Add Task
                        </Button>
                    </div>
                </div>

                {/* Tasks List */}
                <div className="space-y-3">
                    {filteredTasks.length === 0 ? (
                        <Card className="bg-white/60 backdrop-blur-sm border-0 shadow-sm">
                            <CardContent className="py-12 text-center">
                                <div className="text-gray-400 mb-2">
                                    {tasks.length === 0 ? (
                                        <Plus className="h-12 w-12 mx-auto mb-4" />
                                    ) : (
                                        <Filter className="h-12 w-12 mx-auto mb-4" />
                                    )}
                                </div>
                                <p className="text-gray-600 text-lg">
                                    {tasks.length === 0
                                        ? "No tasks yet. Create your first task to get started!"
                                        : "No tasks match your current filters."
                                    }
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        filteredTasks.map((task) => (
                            <TaskCard
                                key={task.id}
                                task={task}
                                onToggle={toggleTask}
                                onEdit={handleEdit}
                                onDelete={deleteTask}
                            />
                        ))
                    )}
                </div>
            </div>

            <TaskForm
                isOpen={isFormOpen}
                onClose={handleCloseForm}
                onSubmit={handleFormSubmit}
                editingTask={editingTask}
            />
        </div>
    );
}