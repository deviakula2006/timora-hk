import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TaskToggle from "../components/TaskToggle";

function TaskDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTask = async () => {
    try {
      const res = await fetch(
        `http://localhost:9000/api/todo/single/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
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

  /* ===== TOGGLE STATUS ===== */
  const toggleStatus = async () => {
    await fetch(`http://localhost:9000/api/todo/complete/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTask(); // refresh data
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Task not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-4">
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="text-purple-600 mb-4 text-sm"
      >
        ← Back
      </button>

      {/* MAIN CARD */}
      <div className="bg-white rounded-2xl shadow-md p-6">
        {/* TITLE + STATUS */}
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold">{task.title}</h1>
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

        {/* DESCRIPTION */}
        {task.description && (
          <p className="text-gray-600 mb-4">{task.description}</p>
        )}

        {/* TOGGLE */}
        <div className="flex items-center gap-3 mb-6">
          <TaskToggle
            checked={task.isCompleted}
            onChange={toggleStatus}
          />
          <span className="text-sm text-gray-600">
            Mark as {task.isCompleted ? "To-Do" : "Completed"}
          </span>
        </div>

        {/* FILES */}
        {task.attachments?.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold mb-2">
              📁 Attachments ({task.attachments.length})
            </h3>
            <ul className="space-y-2">
              {task.attachments.map((file, index) => (
                <li key={index}>
                  <a
                    href={`http://localhost:9000${file.fileUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline text-sm"
                  >
                    {file.fileName}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* RECORDINGS */}
        {task.recordings?.length > 0 && (
          <div>
            <h3 className="font-semibold mb-2">
              🎙️ Recordings ({task.recordings.length})
            </h3>
            <div className="space-y-3">
              {task.recordings.map((rec, index) => (
                <audio
                  key={index}
                  controls
                  className="w-full"
                  src={`http://localhost:9000${rec.fileUrl}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskDetails;
