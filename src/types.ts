export type Status = 'todo' | 'in-progress' | 'completed';

export interface Task {
    id: string;
    title: string;
    status: Status;
    createdAt: number;
}

export type TaskContextType = {
    tasks: Task[];
    addTask: (title: string) => void;
    updateTaskStatus: (id: string, newStatus: Status) => void;
    deleteTask: (id: string) => void;
    moveTask: (activeId: string, overId: string) => void; // For reordering if needed or just status change
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>; // Exposed for DnD
};
