import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskToggle from "../components/TaskToggle";

function CompletedTasks() {

  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  /* ================= FETCH COMPLETED ================= */
  const fetchTasks = async () => {
    try {
      if (!token) return;

      const res = await fetch(
        "http://localhost:9000/api/todo/today",
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await res.json();

      if (Array.isArray(data)) {
        // Only completed tasks
        setTasks(data.filter(t => t.isCompleted));
      } else {
        setTasks([]);
      }

    } catch (err) {
      console.error(err);
      setTasks([]);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    fetchTasks();
  }, [token, navigate]);

  /* ================= TOGGLE ================= */
const toggleTask = async (id) => {
  try {
    await fetch(
      `http://localhost:9000/api/todo/complete/${id}`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    // Remove from completed list instantly
    setTasks(prev => prev.filter(t => t._id !== id));

  } catch (err) {
    console.error(err);
  }
};

  /* ================= DELETE ================= */
  const deleteTask = async (id) => {
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

      setTasks(prev => prev.filter(t => t._id !== id));

    } catch (err) {
      console.error(err);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (id) => {
    navigate(`/edit-task/${id}`);
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  /* ================= UI ================= */
  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">

      {/* ===== TOP BAR (Same as Todo) ===== */}
      <div className="flex justify-between items-center mb-8">

        <button
          onClick={() => navigate(-1)}
          className="bg-white/40 backdrop-blur-md px-4 py-2 rounded-xl shadow"
        >
          ← Back
        </button>

        <button
          onClick={handleLogout}
          className="bg-red-400 text-white px-4 py-2 rounded-xl shadow"
        >
          Logout
        </button>

      </div>

      {/* ===== HEADER ===== */}
      <h2 className="text-2xl font-semibold mb-8 text-green-700">
        ✅ Completed Tasks
      </h2>

      {/* ===== EMPTY ===== */}
      {tasks.length === 0 ? (

        <div className="text-center mt-20">
          <div className="text-6xl">🚀</div>
          <p className="mt-4 text-gray-600">
            No Completed Tasks
          </p>
        </div>

      ) : (

        tasks.map(task => (

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

                {/* Title */}
                <h3 className="text-lg font-semibold truncate line-through text-gray-400">
                  {task.title}
                </h3>

                {/* Description */}
                {task.description && (
                  <p className="text-sm text-gray-600 mt-1 max-w-md truncate">
                    {task.description}
                  </p>
                )}

              </div>

              {/* Toggle + Badge */}
              <div
                className="flex items-center gap-3 shrink-0"
                onClick={(e) => e.stopPropagation()}
              >

                <TaskToggle
                  checked={task.isCompleted}
                  onChange={() => toggleTask(task._id)}
                />

                <span
                  className="
                    text-xs px-3 py-1 rounded-full font-medium
                    bg-green-100 text-green-700
                  "
                >
                  Completed
                </span>

              </div>

            </div>

            {/* Divider */}
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

export default CompletedTasks;
