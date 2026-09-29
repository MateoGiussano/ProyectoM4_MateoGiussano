import type { Task } from "../types/Task";
import TaskItem from "./TaskItem";

type TaskListProps = {
  tasks: Task[];
  onToggle: (taskId: string, completed: boolean) => void;
  onUpdate: (taskId: string, title: string, description: string) => Promise<void>;
  onDelete: (taskId: string) => void;
};

function TaskList({ tasks, onToggle, onUpdate, onDelete }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-stone-200 px-4 py-8 text-center text-sm text-stone-500">
        Todavía no tenés tareas. ¡Creá la primera!
      </p>
    );
  }

  return (
    <ul className="divide-y divide-stone-200">
      {tasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TaskList;