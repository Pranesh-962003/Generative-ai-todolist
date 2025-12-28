import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import { cn } from '../lib/utils';

export function Input() {
    const [title, setTitle] = useState('');
    const { addTask } = useTodo();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            addTask(title.trim());
            setTitle('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-8 w-full max-w-2xl mx-auto">
            <div className="relative flex items-center">
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Add a new task..."
                    className={cn(
                        "w-full px-6 py-4 bg-gray-800/50 border border-gray-700 rounded-xl",
                        "text-gray-100 placeholder:text-gray-500",
                        "focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent",
                        "transition-all duration-200 ease-in-out",
                        "shadow-lg shadow-black/20"
                    )}
                />
                <button
                    type="submit"
                    disabled={!title.trim()}
                    className={cn(
                        "absolute right-2 p-2 rounded-lg",
                        "bg-purple-600 hover:bg-purple-500 disabled:opacity-50 disabled:cursor-not-allowed",
                        "text-white transition-all duration-200",
                        "hover:shadow-lg hover:shadow-purple-500/20"
                    )}
                >
                    <Plus className="w-6 h-6" />
                </button>
            </div>
        </form>
    );
}
