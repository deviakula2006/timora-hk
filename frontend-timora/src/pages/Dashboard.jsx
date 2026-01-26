import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddTaskModal from "../components/AddTaskModal";
import TaskToggle from "../components/TaskToggle";
import Header from "../components/Header";
import { testUpload } from "../services/testUpload";

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // 🔒 Fetch profile
  const fetchProfile = async () => {
    const res = await fetch("http://localhost:9000/api/user/profile", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setUser(data);
  };

  // 📋 Fetch tasks
  const fetchTasks = async () => {
    const res = await fetch("http://localhost:9000/api/todo", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setTasks(data);
  };

  // ➕ ADD TASK
  const saveTask = async (task) => {
    await fetch("http://localhost:9000/api/todo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(task)
    });

    setShowForm(false);
    fetchTasks();
  };

  // ✏️ UPDATE TASK
  const updateTask = async (updatedData) => {
    await fetch(`http://localhost:9000/api/todo/${editTask._id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(updatedData)
    });

    setEditTask(null);
    fetchTasks();
  };

  // 🔁 TOGGLE TASK
  const toggleTask = async (id) => {
    await fetch(`http://localhost:9000/api/todo/complete/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchTasks();
  };

  // 🗑 DELETE TASK
  const deleteTask = async (id) => {
    await fetch(`http://localhost:9000/api/todo/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchTasks();
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchProfile();
    fetchTasks();
  }, []);

  const completedCount = tasks.filter(t => t.isCompleted).length;
  const visibleTasks = tasks.slice(0, 6);

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-4 sm:px-6 sm:py-6">
      {/* HEADER */}
      <Header title="Timora" showBack={false} />

      {/* GREETING */}
      <div className="mb-6">
        <h2 className="text-xl font-bold text-purple-700 break-words">
          Good Morning, {user?.name || user?.email}
        </h2>
        <p className="text-gray-500 text-sm">
          Let’s plan your day better
        </p>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Tasks</p>
          <h2 className="text-2xl font-bold text-purple-600">
            {tasks.length}
          </h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Completed</p>
          <h2 className="text-2xl font-bold text-green-600">
            {completedCount}
          </h2>
        </div>
      </div>

      {/* ADD TASK */}
      <button
        onClick={() => setShowForm(true)}
        className="w-full bg-purple-600 text-white py-3 rounded-xl font-semibold mb-6 hover:bg-purple-700"
      >
        + Add New Task
      </button>

      {/* ADD MODAL */}
      {showForm && (
        <AddTaskModal
          onClose={() => setShowForm(false)}
          onSave={saveTask}
        />
      )}

      {/* EDIT MODAL */}
      {editTask && (
        <AddTaskModal
          initialData={editTask}
          onClose={() => setEditTask(null)}
          onSave={updateTask}
        />
      )}
      {/* TASK LIST HEADER */}
<div className="flex justify-between items-center mb-4">
  <h3 className="text-lg font-semibold">Today’s Tasks</h3>

  {tasks.length > 6 && (
    <button
      onClick={() => navigate("/tasks")}
      className="flex items-center gap-1 px-3 py-1.5 rounded-lg
                 text-purple-700 bg-purple-100
                 hover:bg-purple-200
                 font-semibold text-sm"
    >
      View All
      <span className="text-base">→</span>
    </button>
  )}
</div>

      {/* TASK LIST */}
      <div className="space-y-3">
        {visibleTasks.map(task => (
          <div
            key={task._id}
            className="bg-white p-4 rounded-xl shadow flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3"
          >
            <p
              className={`font-medium break-words ${
                task.isCompleted ? "line-through text-gray-400" : ""
              }`}
            >
              {task.title}
            </p>

            <div className="flex items-center justify-between sm:justify-end gap-3">
              <TaskToggle
                checked={task.isCompleted}
                onChange={() => toggleTask(task._id)}
              />

              <button
                onClick={() => setEditTask(task)}
                className="text-blue-500 text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => deleteTask(task._id)}
                className="text-red-500 text-sm"
              >
                Delete
              </button>
              <button
  onClick={() => {
    console.log("EDIT TASK:", task);
    setEditTask(task);
  }}
>
  Edit
</button>

            </div>
            
          </div>
        ))}
      </div>
      <input
  type="file"
  onChange={(e) => testUpload(e.target.files[0])}
/>

    </div>
  );
}

export default Dashboard;
