
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AddTaskModal from "../components/AddTaskModal";
import TaskToggle from "../components/TaskToggle";
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

  const visibleTasks = showAll ? tasks : tasks.slice(0, 6);

  /* ================= UI ================= */
  return (
    <div className="
      min-h-screen
      bg-gradient-to-br
      from-purple-50
      via-indigo-50
      to-pink-50
      p-6
    ">

      {/* ===== GREETING CARD ===== */}
      <div className="
        relative overflow-hidden
        bg-gradient-to-r from-purple-400 to-indigo-300
        text-white rounded-3xl p-6 mb-8
        shadow-[0_8px_40px_rgba(139,92,246,0.35)]
      ">

        {/* Cloud BG */}
        <img
          src="/ui/cloud.svg"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        <div className="relative z-10 flex justify-between items-center">

          <div>
            <h2 className="text-2xl font-semibold">
              Hello 👋
            </h2>

            <p className="text-sm opacity-90 mt-1">
              Today : {new Date().toDateString()}
            </p>

            <p className="text-sm opacity-80 mt-2">
              Organize your tasks efficiently and boost productivity.
            </p>
          </div>

          <button
            onClick={() => {
              setEditTask(null);
              setShowForm(true);
            }}
            className="
              bg-white text-purple-600 px-5 py-2
              rounded-lg font-medium
              shadow-md hover:shadow-lg
              hover:-translate-y-0.5
              transition
            "
          >
            + Add Task
          </button>

        </div>
      </div>

      {/* ===== SUMMARY CARDS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

        {/* Completed */}
        <div
          onClick={() => navigate("/completed")}
          className="
            relative overflow-hidden
            bg-gradient-to-r from-green-300 to-emerald-200
            p-5 rounded-2xl cursor-pointer

            shadow-[0_4px_20px_rgba(0,0,0,0.06)]
            hover:-translate-y-1
            transition
          "
        >

          {/* Yellow Radiance */}
          <div className="
            absolute -top-10 -right-10
            w-40 h-40
            bg-yellow-300 opacity-30
            blur-3xl rounded-full
          " />

          <img
            src="/ui/wave.svg"
            className="absolute bottom-0 w-full opacity-40"
          />

          <div className="relative z-10">
            <p className="text-sm text-gray-700">
              Completed Tasks
            </p>

            <h3 className="text-2xl font-bold text-gray-900">
              {tasks.filter(t => t.isCompleted).length}
            </h3>
          </div>
        </div>

        {/* Todo */}
        <div
          onClick={() => navigate("/todo")}
          className="
            relative overflow-hidden
            bg-gradient-to-r from-blue-300 to-indigo-200
            p-5 rounded-2xl cursor-pointer

            shadow-[0_4px_20px_rgba(0,0,0,0.06)]
            hover:-translate-y-1
            transition
          "
        >

          <div className="
            absolute -top-10 -right-10
            w-40 h-40
            bg-yellow-200 opacity-25
            blur-3xl rounded-full
          " />

          <img
            src="/ui/wave.svg"
            className="absolute bottom-0 w-full opacity-40"
          />

          <div className="relative z-10">
            <p className="text-sm text-gray-700">
              Todo Tasks
            </p>

            <h3 className="text-2xl font-bold text-gray-900">
              {tasks.filter(t => !t.isCompleted).length}
            </h3>
          </div>
        </div>

        {/* All */}
        <div
          onClick={() => navigate("/tasks")}
          className="
            relative overflow-hidden
            bg-gradient-to-r from-purple-300 to-pink-200
            p-5 rounded-2xl cursor-pointer

            shadow-[0_4px_20px_rgba(0,0,0,0.06)]
            hover:-translate-y-1
            transition
          "
        >

          <div className="
            absolute -top-10 -right-10
            w-40 h-40
            bg-yellow-200 opacity-25
            blur-3xl rounded-full
          " />

          <img
            src="/ui/wave.svg"
            className="absolute bottom-0 w-full opacity-40"
          />

          <div className="relative z-10">
            <p className="text-sm text-gray-700">
              All Tasks
            </p>

            <h3 className="text-2xl font-bold text-gray-900">
              {tasks.length}
            </h3>
          </div>
        </div>

      </div>

      {/* ===== MODALS ===== */}
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
{/* ===== EMPTY OR TASK LIST ===== */}

{tasks.length === 0 ? (

  /* ===== EMPTY STATE ===== */
  <div className="flex flex-col items-center justify-center mt-20 text-center">

    {/* Emoji */}
    <div className="text-7xl animate-bounce">
      🎯
    </div>

    {/* Text */}
    <h2 className="text-xl font-semibold text-gray-800 mt-4">
      No tasks yet
    </h2>

    <p className="text-gray-600 mt-1">
      Set your goals & start your day
    </p>

    {/* Same Add Task functionality */}
    <button
      onClick={() => {
        setEditTask(null);
        setShowForm(true);
      }}
      className="
        mt-6 px-6 py-2
        bg-purple-500 text-white
        rounded-xl font-medium
        shadow hover:shadow-lg
        transition
      "
    >
      + Create First Task
    </button>

  </div>

) : (

  /* ===== TASK LIST ===== */
  visibleTasks.map(task => (

    <div
      key={task._id}
      onClick={() => navigate(`/task/${task._id}`)}
      className="
        relative overflow-hidden
        rounded-2xl p-5 mb-6
        bg-white/70 backdrop-blur-md
        border border-purple-100
        shadow-[0_4px_20px_rgba(139,92,246,0.08)]
        hover:shadow-[0_12px_40px_rgba(139,92,246,0.25)]
        hover:-translate-y-1
        hover:bg-white
        transition-all duration-300
        cursor-pointer
      "
    >

      {/* TOP ROW */}
      <div className="flex justify-between items-start gap-4">

        <div className="flex-1 min-w-0">

          <h3
            className={`text-lg font-semibold truncate ${
              task.isCompleted
                ? "line-through text-gray-400"
                : "text-gray-800"
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-sm text-black-1000 mt-1 max-w-md truncate">
              {task.description}
            </p>
          )}

        </div>

        <div
          className="flex items-center gap-3 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >

          <TaskToggle
            checked={task.isCompleted}
            onChange={() => toggleTask(task._id)}
          />

          <span
            className={`
              text-xs px-3 py-1 rounded-full font-medium
              ${
                task.isCompleted
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }
            `}
          >
            {task.isCompleted ? "Completed" : "To-Do"}
          </span>

        </div>

      </div>

      <div className="border-t border-purple-100 my-4" />

      {/* ACTIONS */}
      <div
        className="flex justify-end gap-6"
        onClick={(e) => e.stopPropagation()}
      >

        {/* Edit */}
        <div
          onClick={() => handleEdit(task._id)}
          className="flex flex-col items-center cursor-pointer"
        >
          ✏️
          <span className="text-xs font-semibold text-black">
            Edit
          </span>
        </div>

        {/* Delete */}
        <div
          onClick={() => deleteTask(task._id)}
          className="flex flex-col items-center cursor-pointer"
        >
          🗑️
          <span className="text-xs font-semibold text-black">
            Delete
          </span>
        </div>

      </div>

    </div>

  ))

)}




      

    </div>
  );
}

export default Dashboard; 