import { useState } from 'react';
import {
    DndContext,
    DragOverlay,
    useSensors,
    useSensor,
    PointerSensor,
    KeyboardSensor,
    defaultDropAnimationSideEffects,
    type DragStartEvent,
    type DragOverEvent,
    type DragEndEvent,
    closestCorners,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { useTodo } from '../context/TodoContext';
import { Column } from './Column';
import { TaskCard } from './TaskCard';
import type { Task, Status } from '../types';

export function Board() {
    const { tasks, setTasks, updateTaskStatus } = useTodo();
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const columns: Status[] = ['todo', 'in-progress', 'completed'];

    const getTasksByStatus = (status: Status) => {
        return tasks.filter((task) => task.status === status);
    };

    const findTask = (id: string) => tasks.find((t) => t.id === id);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const task = findTask(active.id as string);
        if (task) setActiveTask(task);
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id as string;
        const overId = over.id as string;

        const activeTask = findTask(activeId);
        const overTask = findTask(overId);

        if (!activeTask) return;

        // Dropping over a column (empty or not)
        if (columns.includes(overId as Status)) {
            const overStatus = overId as Status;
            if (activeTask.status !== overStatus) {
                setTasks((prev) => {
                    const activeIndex = prev.findIndex((t) => t.id === activeId);
                    const newTasks = [...prev];
                    newTasks[activeIndex] = { ...newTasks[activeIndex], status: overStatus };
                    return newTasks;
                })
            }
            return;
        }

        // Dropping over another task
        if (!overTask) return;

        if (activeTask.status !== overTask.status) {
            setTasks((prev) => {
                const activeIndex = prev.findIndex((t) => t.id === activeId);
                const overIndex = prev.findIndex((t) => t.id === overId);

                if (prev[activeIndex].status !== prev[overIndex].status) {
                    const newTasks = [...prev];
                    newTasks[activeIndex] = { ...newTasks[activeIndex], status: prev[overIndex].status };
                    return arrayMove(newTasks, activeIndex, overIndex - 1); // Insert before? Or let onDragEnd handle order?
                    // Actually for different containers, we usually just update status here and maybe index.
                    // arrayMove works on the flat list.
                }
                return prev;
            });
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        const activeId = active.id as string;
        const overId = over ? (over.id as string) : null;

        if (!overId) {
            setActiveTask(null);
            return;
        }

        const activeTask = findTask(activeId);
        const overTask = findTask(overId);

        if (activeTask && overTask && activeTask.status === overTask.status && activeId !== overId) {
            const activeIndex = tasks.findIndex((t) => t.id === activeId);
            const overIndex = tasks.findIndex((t) => t.id === overId);
            setTasks((prev) => arrayMove(prev, activeIndex, overIndex));
        }

        // If dropped on column, handled in dragOver mostly, but let's ensure
        if (activeTask && columns.includes(overId as Status)) {
            if (activeTask.status !== overId) {
                updateTaskStatus(activeId, overId as Status);
            }
        }

        setActiveTask(null);
    };

    const dropAnimation = {
        sideEffects: defaultDropAnimationSideEffects({
            styles: {
                active: {
                    opacity: '0.5',
                },
            },
        }),
    };

    return (
        <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div className="flex flex-col md:flex-row gap-4 md:gap-6 h-full overflow-x-auto pb-4">
                <div className="flex-1 min-h-[300px] md:min-h-0 md:h-full md:min-w-[300px]">
                    <Column id="todo" title="To Do" tasks={getTasksByStatus('todo')} />
                </div>
                <div className="flex-1 min-h-[300px] md:min-h-0 md:h-full md:min-w-[300px]">
                    <Column id="in-progress" title="In Progress" tasks={getTasksByStatus('in-progress')} />
                </div>
                <div className="flex-1 min-h-[300px] md:min-h-0 md:h-full md:min-w-[300px]">
                    <Column id="completed" title="Completed" tasks={getTasksByStatus('completed')} />
                </div>
            </div>

            <DragOverlay dropAnimation={dropAnimation}>
                {activeTask ? <TaskCard task={activeTask} /> : null}
            </DragOverlay>
        </DndContext>
    );
}
