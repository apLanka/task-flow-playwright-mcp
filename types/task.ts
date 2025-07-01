export interface Task {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    priority: 'low' | 'medium' | 'high';
    category: string;
    createdAt: Date;
    completedAt?: Date;
}

export interface TaskFormData {
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    category: string;
}