import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useDroppable } from '@dnd-kit/core';
import type { Task, Status } from '../types';
import { TaskCard } from './TaskCard';
import { cn } from '../lib/utils';

interface ColumnProps {
    id: Status;
    title: string;
    tasks: Task[];
}

export function Column({ id, title, tasks }: ColumnProps) {
    const { setNodeRef } = useDroppable({
        id: id,
    });

    return (
        <div className="flex flex-col h-full bg-gray-900/30 rounded-xl p-2 md:p-0">
            <div className="flex items-center justify-between mb-3 px-2">
                <h2 className="text-lg md:text-xl font-bold text-gray-100">{title}</h2>
                <span className="px-2.5 py-0.5 text-xs md:text-sm font-medium bg-gray-800 text-gray-400 rounded-full">
                    {tasks.length}
                </span>
            </div>

            <div
                ref={setNodeRef}
                className={cn(
                    "flex-1 p-3 md:p-4 rounded-xl bg-gray-900/50 border-2 border-dashed border-gray-800",
                    "transition-colors duration-200 overflow-y-auto min-h-[150px]"
                )}
            >
                <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
                    <div className="flex flex-col gap-3">
                        {tasks.map((task) => (
                            <TaskCard key={task.id} task={task} />
                        ))}
                    </div>
                </SortableContext>

                {tasks.length === 0 && (
                    <div className="h-full flex items-center justify-center text-gray-600 text-sm">
                        Drop items here
                    </div>
                )}
            </div>
        </div>
    );
}
