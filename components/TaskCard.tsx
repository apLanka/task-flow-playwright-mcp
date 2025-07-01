'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types/task';
import { CheckCircle2, Circle, Edit, Trash2, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface TaskCardProps {
    task: Task;
    onToggle: (id: string) => void;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
}

const priorityColors = {
    low: 'bg-green-100 text-green-800 hover:bg-green-200',
    medium: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
    high: 'bg-red-100 text-red-800 hover:bg-red-200'
};

const priorityDots = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500'
};

export function TaskCard({ task, onToggle, onEdit, onDelete }: TaskCardProps) {
    return (
        <Card className={`group transition-all duration-200 hover:shadow-md border-l-4 ${
            task.completed
                ? 'bg-gray-50 border-l-gray-300 opacity-75'
                : `border-l-${task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'yellow' : 'green'}-400`
        }`}>
            <CardContent className="p-4">
                <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                        <button
                            onClick={() => onToggle(task.id)}
                            className={`mt-1 transition-colors ${
                                task.completed ? 'text-green-600' : 'text-gray-400 hover:text-blue-600'
                            }`}
                        >
                            {task.completed ? (
                                <CheckCircle2 className="h-5 w-5" />
                            ) : (
                                <Circle className="h-5 w-5" />
                            )}
                        </button>

                        <div className="flex-1 min-w-0">
                            <h3 className={`font-medium text-sm leading-5 ${
                                task.completed ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}>
                                {task.title}
                            </h3>

                            {task.description && (
                                <p className={`text-sm mt-1 ${
                                    task.completed ? 'line-through text-gray-400' : 'text-gray-600'
                                }`}>
                                    {task.description}
                                </p>
                            )}

                            <div className="flex items-center gap-2 mt-3">
                                <div className="flex items-center gap-1">
                                    <div className={`w-2 h-2 rounded-full ${priorityDots[task.priority]}`} />
                                    <Badge
                                        variant="secondary"
                                        className={`text-xs px-2 py-0.5 ${priorityColors[task.priority]}`}
                                    >
                                        {task.priority}
                                    </Badge>
                                </div>

                                {task.category && (
                                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                                        {task.category}
                                    </Badge>
                                )}

                                <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
                                    <Clock className="h-3 w-3" />
                                    {format(task.createdAt, 'MMM d')}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onEdit(task)}
                            className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
                        >
                            <Edit className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => onDelete(task.id)}
                            className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
                        >
                            <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}