'use client';

import { useState } from 'react';
import { Task, TaskInput } from '@/types/task';
import TaskForm from './TaskForm';

interface TaskCardProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<TaskInput>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggleComplete: (id: string, completed: boolean) => Promise<void>;
}

export default function TaskCard({ task, onUpdate, onDelete, onToggleComplete }: TaskCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const priorityStyles = {
    low: 'border-l-green-500 bg-green-50 dark:bg-green-900/20',
    medium: 'border-l-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
    high: 'border-l-red-500 bg-red-50 dark:bg-red-900/20',
  };

  const priorityBadge = {
    low: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
    medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    high: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleUpdate = async (updates: TaskInput) => {
    await onUpdate(task.id, updates);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Edit Task</h3>
        <TaskForm
          onSubmit={handleUpdate}
          initialData={task}
          submitLabel="Update Task"
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border-l-4 overflow-hidden transition-all hover:shadow-xl ${
        priorityStyles[task.priority]
      } ${task.completed ? 'opacity-60' : ''}`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          <button
            onClick={() => onToggleComplete(task.id, !task.completed)}
            className={`mt-1 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
              task.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 dark:border-gray-600 hover:border-green-500'
            }`}
          >
            {task.completed && (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3
                className={`text-lg font-semibold text-gray-900 dark:text-white truncate ${
                  task.completed ? 'line-through' : ''
                }`}
              >
                {task.title}
              </h3>
              <span className={`px-2 py-0.5 text-xs font-medium rounded-full capitalize ${priorityBadge[task.priority]}`}>
                {task.priority}
              </span>
            </div>

            {task.description && (
              <p className={`text-gray-600 dark:text-gray-400 text-sm mb-3 ${task.completed ? 'line-through' : ''}`}>
                {task.description}
              </p>
            )}

            <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
              <span>Created: {task.createdAt.toLocaleDateString()}</span>
              {task.updatedAt.getTime() !== task.createdAt.getTime() && (
                <span>Updated: {task.updatedAt.toLocaleDateString()}</span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg transition-all"
              title="Edit task"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all disabled:opacity-50"
              title="Delete task"
            >
              {isDeleting ? (
                <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
