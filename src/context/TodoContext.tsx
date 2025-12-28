import React, { createContext, useContext, useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import type { Task, Status, TaskContextType } from '../types';

const TodoContext = createContext<TaskContextType | undefined>(undefined);

export const TodoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>(() => {
        const saved = localStorage.getItem('tasks');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }, [tasks]);

    const addTask = (title: string) => {
        const newTask: Task = {
            id: uuidv4(),
            title,
            status: 'todo',
            createdAt: Date.now(),
        };
        setTasks((prev) => [...prev, newTask]);
    };

    const updateTaskStatus = (id: string, newStatus: Status) => {
        setTasks((prev) =>
            prev.map((task) => (task.id === id ? { ...task, status: newStatus } : task))
        );
    };

    const deleteTask = (id: string) => {
        setTasks((prev) => prev.filter((task) => task.id !== id));
    };

    // For DnD, we might need a more complex move if reordering within columns is required.
    // For now, let's assume we just handle status changes via DnD for simplicity, 
    // or simple reordering.
    // We'll implement a flexible setTasks for the DnD handler to use.
    const moveTask = (_activeId: string, _overId: string) => {
        // Placeholder
    };

    return (
        <TodoContext.Provider value={{ tasks, addTask, updateTaskStatus, deleteTask, moveTask, setTasks }}>
            {children}
        </TodoContext.Provider>
    );
};

export const useTodo = () => {
    const context = useContext(TodoContext);
    if (!context) {
        throw new Error('useTodo must be used within a TodoProvider');
    }
    return context;
};
