import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TaskToggle from "../components/TaskToggle";
import AddTaskModal from "../components/AddTaskModal";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editTask, setEditTask] = useState(null);

  /* ================= FETCH ================= */
  const fetchTask = async () => {
    try {
      const res = await fetch(
        `http://localhost:9000/api/todo/single/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      const data = await res.json();
      setTask(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [id]);

  /* ================= TOGGLE ================= */
  const toggleStatus = async () => {
    await fetch(
      `http://localhost:9000/api/todo/complete/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    fetchTask();
  };

  /* ================= DELETE ================= */
  const deleteTask = async () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmDelete) return;

    try {
      await fetch(
        `http://localhost:9000/api/todo/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      navigate(-1);
    } catch (err) {
      console.error(err);
    }
  };

  /* ================= OPEN EDIT ================= */
  const openEditModal = () => {
    setEditTask(task);
  };

  /* ================= UPDATE ================= */
  const updateTask = async (data) => {
    const formData = new FormData();

    formData.append("title", data.title);
    formData.append("description", data.description || "");
    formData.append("isCompleted", data.isCompleted);

    data.files.forEach(file =>
      formData.append("files", file)
    );

    if (data.audioBlob) {
      formData.append("audio", data.audioBlob);
    }

    await fetch(
      `http://localhost:9000/api/todo/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      }
    );

    setEditTask(null);
    fetchTask();
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading task details…</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Task not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      {/* ===== TOP BAR ===== */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-white/60 backdrop-blur-md px-4 py-2 rounded-xl shadow hover:bg-white transition"
        >
          ← Back
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-400 text-white px-4 py-2 rounded-xl shadow hover:bg-red-500 transition"
        >
          Logout
        </button>
      </div>

      {/* ===== MAIN CARD ===== */}
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-8">
        {/* TITLE + STATUS */}
        <div className="flex justify-between items-start gap-4 mb-4">
          <h1 className="text-2xl font-bold text-gray-800 break-words">
            {task.title}
          </h1>

          <span
            className={`text-xs px-4 py-1 rounded-full font-semibold shadow ${
              task.isCompleted
                ? "bg-green-100 text-green-700"
                : "bg-yellow-100 text-yellow-700"
            }`}
          >
            {task.isCompleted ? "Completed" : "To-Do"}
          </span>
        </div>

        {/* DESCRIPTION */}
        {task.description && (
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-4 mb-6">
            <p className="text-gray-700 leading-relaxed">
              {task.description}
            </p>
          </div>
        )}

        {/* STATUS TOGGLE */}
        <div className="flex items-center justify-between bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-100 rounded-xl p-4 mb-6">
          <div>
            <p className="text-sm font-semibold text-gray-700">
              Task Status
            </p>
            <p className="text-xs text-gray-500">
              Mark this task as completed or pending
            </p>
          </div>

          <TaskToggle
            checked={task.isCompleted}
            onChange={toggleStatus}
          />
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-4 mb-8">
          <button
            onClick={openEditModal}
            className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-xl shadow hover:bg-indigo-600 transition"
          >
            ✏️ Edit
          </button>

          <button
            onClick={deleteTask}
            className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-xl shadow hover:bg-red-600 transition"
          >
            🗑️ Delete
          </button>
        </div>

        {/* ATTACHMENTS */}
        {task.attachments?.length > 0 && (
          <div className="mb-8">
            <h3 className="font-semibold text-purple-700 mb-3">
              📁 Attachments ({task.attachments.length})
            </h3>
            <div className="grid gap-3">
              {task.attachments.map((file, index) => (
                <a
                  key={index}
                  href={`http://localhost:9000${file.fileUrl}`}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-white border border-purple-100 rounded-xl p-3 shadow-sm hover:shadow-md hover:bg-purple-50 transition text-sm text-blue-600 underline"
                >
                  {file.fileName}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* RECORDINGS */}
        {task.recordings?.length > 0 && (
          <div>
            <h3 className="font-semibold text-purple-700 mb-3">
              🎙️ Recordings ({task.recordings.length})
            </h3>
            <div className="space-y-4">
              {task.recordings.map((rec, index) => (
                <div
                  key={index}
                  className="bg-white border border-purple-100 rounded-xl p-3 shadow-sm"
                >
                  <audio
                    controls
                    className="w-full"
                    src={`http://localhost:9000${rec.fileUrl}`}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ===== EDIT MODAL ===== */}
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

export default TaskDetails;