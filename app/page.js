"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../lib/firebase";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import styles from "./home.module.css";

export default function Home() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [filter, setFilter] = useState("all"); // all | pending | completed
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        router.push("/login");
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "tasks"), where("userId", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const taskList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(taskList);
    });
    return () => unsubscribe();
  }, [user]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    await addDoc(collection(db, "tasks"), {
      title: newTask,
      isComplete: false,
      dueDate: dueDate || null,
      priority: priority,
      userId: user.uid,
      createdAt: new Date(),
    });
    setNewTask("");
    setDueDate("");
    setPriority("Medium");
  };

  const toggleComplete = async (task) => {
    await updateDoc(doc(db, "tasks", task.id), {
      isComplete: !task.isComplete,
    });
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/login");
  };

  const isOverdue = (task) => {
    if (!task.dueDate || task.isComplete) return false;
    const today = new Date().toISOString().split("T")[0];
    return task.dueDate < today;
  };

  const priorityColor = (p) => {
    if (p === "High") return styles.priorityHigh;
    if (p === "Low") return styles.priorityLow;
    return styles.priorityMedium;
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === "pending") return !task.isComplete;
    if (filter === "completed") return task.isComplete;
    return true;
  });

  const completedCount = tasks.filter((t) => t.isComplete).length;

  if (loading) return <p>Loading...</p>;

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <h1 className={styles.title}>My Tasks</h1>
          <button onClick={handleLogout} className={styles.logoutBtn}>
            Logout
          </button>
        </div>

        <form onSubmit={handleAddTask} className={styles.form}>
          <input
            type="text"
            placeholder="Add a new task..."
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            className={styles.input}
          />
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className={styles.dateInput}
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className={styles.select}
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          <button type="submit" className={styles.addBtn}>
            Add
          </button>
        </form>

        <div className={styles.summaryBar}>
          <span className={styles.summaryText}>
            {completedCount} of {tasks.length} completed
          </span>
          <div className={styles.filterGroup}>
            <button
              className={filter === "all" ? styles.filterActive : styles.filterBtn}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            <button
              className={filter === "pending" ? styles.filterActive : styles.filterBtn}
              onClick={() => setFilter("pending")}
            >
              Pending
            </button>
            <button
              className={filter === "completed" ? styles.filterActive : styles.filterBtn}
              onClick={() => setFilter("completed")}
            >
              Completed
            </button>
          </div>
        </div>

        <ul className={styles.taskList}>
          {filteredTasks.map((task) => (
            <li key={task.id} className={styles.taskItem}>
              <div className={styles.taskLeft}>
                <span
                  onClick={() => toggleComplete(task)}
                  className={
                    task.isComplete ? styles.taskDone : styles.taskText
                  }
                >
                  {task.title}
                </span>
                <div className={styles.taskMeta}>
                  <span className={`${styles.priorityBadge} ${priorityColor(task.priority)}`}>
                    {task.priority || "Medium"}
                  </span>
                  {task.dueDate && (
                    <span
                      className={
                        isOverdue(task) ? styles.overdueDate : styles.dueDateText
                      }
                    >
                      {isOverdue(task) ? "Overdue: " : "Due: "}
                      {task.dueDate}
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleDelete(task.id)}
                className={styles.deleteBtn}
              >
                ✕
              </button>
            </li>
          ))}
        </ul>

        {filteredTasks.length === 0 && (
          <p className={styles.emptyText}>No tasks here. Add one above!</p>
        )}
      </div>
    </div>
  );
}