import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddTaskModal from "../components/AddTaskModal";
import TaskToggle from "../components/TaskToggle";
import Header from "../components/Header";
import axios from "axios";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);
  const [showAll, setShowAll] = useState(false);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ================= FETCH ================= */
  const fetchTasks = async () => {
    const res = await fetch("http://localhost:9000/api/todo/today", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }
    fetchTasks();
  }, []);

  /* ================= CREATE ================= */
  const saveTask = async (task) => {
    const formData = new FormData();
    formData.append("title", task.title);
    formData.append("description", task.description || "");
    formData.append("isCompleted", task.isCompleted);

    task.files.forEach(file => formData.append("files", file));
    if (task.audioBlob) formData.append("audio", task.audioBlob);

    await fetch("http://localhost:9000/api/todo", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    });

    setShowForm(false);
    fetchTasks();
  };

  /* ================= EDIT ================= */
  const handleEdit = async (taskId) => {
    const res = await fetch(
      `http://localhost:9000/api/todo/single/${taskId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    const fullTask = await res.json();
    setEditTask(fullTask);
  };

  const updateTask = async (data) => {
    const formData = new FormData();
    formData.append("title", data.title);
    formData.append("description", data.description || "");
    formData.append("isCompleted", data.isCompleted);

    data.files.forEach(file => formData.append("files", file));
    if (data.audioBlob) formData.append("audio", data.audioBlob);

    if (data.removedFiles.length) {
      formData.append("removedFiles", JSON.stringify(data.removedFiles));
    }
    if (data.removedRecordings.length) {
      formData.append(
        "removedRecordings",
        JSON.stringify(data.removedRecordings)
      );
    }

    await axios.patch(
      `http://localhost:9000/api/todo/${editTask._id}`,
      formData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setEditTask(null);
    fetchTasks();
  };

  /* ================= TOGGLE ================= */
  const toggleTask = async (id) => {
    await fetch(`http://localhost:9000/api/todo/complete/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTasks();
  };

  /* ================= DELETE ================= */
  const deleteTask = async (id) => {
    await fetch(`http://localhost:9000/api/todo/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTasks();
  };

  /* ================= UI ================= */
  const visibleTasks = showAll ? tasks : tasks.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-4">
      <Header title="Timora" showBack={false} />

      <button
        onClick={() => {
          setEditTask(null);
          setShowForm(true);
        }}
        className="w-full bg-purple-600 text-white py-3 rounded-xl mb-6 text-lg font-medium"
      >
        + Add New Task
      </button>

      {showForm && !editTask && (
        <AddTaskModal onClose={() => setShowForm(false)} onSave={saveTask} />
      )}

      {editTask && (
        <AddTaskModal
          initialData={editTask}
          onClose={() => setEditTask(null)}
          onSave={updateTask}
        />
      )}

      {visibleTasks.map(task => (
        <div
          key={task._id}
          onClick={() => navigate(`/task/${task._id}`)}
          className="bg-white rounded-2xl shadow-sm px-6 py-5 mb-4
                     cursor-pointer hover:shadow-md transition"
        >
          {/* TITLE + STATUS */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <p
                className={`text-lg font-semibold ${
                  task.isCompleted ? "line-through text-gray-400" : ""
                }`}
              >
                {task.title}
              </p>

              {task.description && (
                <p className="text-sm text-gray-500 mt-1">
                  {task.description}
                </p>
              )}
            </div>

            <span
              className={`text-xs px-3 py-1 rounded-full font-medium ${
                task.isCompleted
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {task.isCompleted ? "Completed" : "To-Do"}
            </span>
          </div>

          {/* ACTIONS */}
          <div
            className="flex items-center justify-center gap-6 mt-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* TOGGLE */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">To-Do</span>
              <TaskToggle
                checked={task.isCompleted}
                onChange={() => toggleTask(task._id)}
              />
              <span className="text-xs text-gray-500">Done</span>
            </div>

            {/* EDIT */}
            <button
              onClick={() => handleEdit(task._id)}
              className="px-4 py-1.5 rounded-lg bg-blue-100
                         text-blue-700 text-sm font-medium hover:bg-blue-200"
            >
              Edit
            </button>

            {/* DELETE */}
            <button
              onClick={() => deleteTask(task._id)}
              className="px-4 py-1.5 rounded-lg bg-red-100
                         text-red-700 text-sm font-medium hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {/* VIEW ALL */}
      {tasks.length > 6 && !showAll && (
       <button
  onClick={() => navigate("/tasks")}
  className="w-full mt-4 text-purple-600 font-medium"
>
  View All Tasks →
</button>

      )}
    </div>
  );
}

export default Dashboard;
