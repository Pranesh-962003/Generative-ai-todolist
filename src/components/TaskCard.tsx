import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical } from 'lucide-react';
import type { Task } from '../types';
import { useTodo } from '../context/TodoContext';
import { cn } from '../lib/utils';

interface TaskCardProps {
    task: Task;
}

export function TaskCard({ task }: TaskCardProps) {
    const { deleteTask } = useTodo();
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
        data: {
            type: 'Task',
            task,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="opacity-30 bg-gray-800 p-4 rounded-xl border-2 border-purple-500 h-[100px]"
            />
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={cn(
                "group relative bg-gray-800/50 p-4 rounded-xl hover:bg-gray-800 transition-all",
                "border border-gray-700/50 hover:border-purple-500/50",
                "shadow-sm hover:shadow-md"
            )}
        >
            <div className="flex items-center gap-3">
                <button
                    {...attributes}
                    {...listeners}
                    className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-gray-700 text-gray-500 hover:text-gray-300"
                >
                    <GripVertical className="w-5 h-5" />
                </button>

                <p className="flex-1 text-gray-200 font-medium break-all">
                    {task.title}
                </p>

                <button
                    onClick={() => deleteTask(task.id)}
                    className={cn(
                        "opacity-0 group-hover:opacity-100 transition-opacity",
                        "p-2 rounded-lg hover:bg-red-500/10 text-gray-500 hover:text-red-500"
                    )}
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="mt-2 pl-9 text-xs text-gray-500">
                {new Date(task.createdAt).toLocaleDateString()}
            </div>
        </div>
    );
}
