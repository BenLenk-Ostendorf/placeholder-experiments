import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  orderBy,
  Timestamp,
  onSnapshot,
} from 'firebase/firestore';
import { db } from './firebase';
import { Task, TaskInput } from '@/types/task';

const COLLECTION_NAME = 'tasks';

// Convert Firestore document to Task
const convertDoc = (doc: any): Task => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title,
    description: data.description,
    completed: data.completed,
    priority: data.priority,
    createdAt: data.createdAt?.toDate() || new Date(),
    updatedAt: data.updatedAt?.toDate() || new Date(),
  };
};

// Create a new task
export const createTask = async (taskInput: TaskInput): Promise<string> => {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    ...taskInput,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
  return docRef.id;
};

// Get all tasks
export const getTasks = async (): Promise<Task[]> => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(convertDoc);
};

// Subscribe to tasks (real-time updates)
export const subscribeTasks = (callback: (tasks: Task[]) => void) => {
  const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
  return onSnapshot(q, (querySnapshot) => {
    const tasks = querySnapshot.docs.map(convertDoc);
    callback(tasks);
  });
};

// Update a task
export const updateTask = async (id: string, updates: Partial<TaskInput>): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
};

// Delete a task
export const deleteTask = async (id: string): Promise<void> => {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
};

// Toggle task completion
export const toggleTaskComplete = async (id: string, completed: boolean): Promise<void> => {
  await updateTask(id, { completed });
};
