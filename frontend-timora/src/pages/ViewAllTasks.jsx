import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskToggle from "../components/TaskToggle";
import AddTaskModal from "../components/AddTaskModal";
import Header from "../components/Header";
import axios from "axios";

function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [editTask, setEditTask] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ===== FETCH ALL TASKS ===== */
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

  /* ===== SEARCH FILTER ===== */
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase()) ||
    task.description?.toLowerCase().includes(search.toLowerCase())
  );

  /* ===== TOGGLE ===== */
  const toggleTask = async (id) => {
    await fetch(`http://localhost:9000/api/todo/complete/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTasks();
  };

  /* ===== EDIT ===== */
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

  /* ===== DELETE ===== */
  const deleteTask = async (id) => {
    await fetch(`http://localhost:9000/api/todo/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-4">
      <Header title="All Tasks" showBack={true} />

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full mb-5 px-4 py-3 rounded-xl border
                   focus:outline-none focus:ring-2 focus:ring-purple-400"
      />

      {filteredTasks.map(task => (
        <div
          key={task._id}
          onClick={() => navigate(`/task/${task._id}`)}
          className="bg-white rounded-2xl shadow-sm px-6 py-5 mb-4
                     cursor-pointer hover:shadow-md transition"
        >
          {/* TITLE */}
          <div className="flex justify-between items-start mb-4">
            <div>
              <p className={`text-lg font-semibold ${
                task.isCompleted ? "line-through text-gray-400" : ""
              }`}>
                {task.title}
              </p>

              {task.description && (
                <p className="text-sm text-gray-500 mt-1">
                  {task.description}
                </p>
              )}
            </div>

            <span className={`text-xs px-3 py-1 rounded-full font-medium ${
              task.isCompleted
                ? "bg-green-100 text-green-700"
                : "bg-gray-200 text-gray-700"
            }`}>
              {task.isCompleted ? "Completed" : "To-Do"}
            </span>
          </div>

          {/* ACTIONS */}
          <div
            className="flex items-center justify-center gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <TaskToggle
              checked={task.isCompleted}
              onChange={() => toggleTask(task._id)}
            />

            <button
              onClick={() => handleEdit(task._id)}
              className="px-4 py-1.5 rounded-lg bg-blue-100 text-blue-700 text-sm"
            >
              Edit
            </button>

            <button
              onClick={() => deleteTask(task._id)}
              className="px-4 py-1.5 rounded-lg bg-red-100 text-red-700 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      ))}

      {editTask && (
        <AddTaskModal
          initialData={editTask}
          onClose={() => setEditTask(null)}
          onSave={updateTask}
        />
      )}
    </div>
  );
}

export default AllTasks;
