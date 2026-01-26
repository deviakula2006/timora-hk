import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TaskToggle from "../components/TaskToggle";

function TaskDetails() {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const token = localStorage.getItem("token");

  const fetchTask = async () => {
    const res = await fetch(`http://localhost:9000/api/todo/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setTask(data);
  };

  const toggleTask = async () => {
    await fetch(`http://localhost:9000/api/todo/complete/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTask();
  };

  useEffect(() => {
    fetchTask();
  }, []);

  if (!task) return null;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="bg-white p-6 rounded-xl shadow">

        <h2 className="text-2xl font-bold text-purple-700 mb-2">
          {task.title}
        </h2>

        <p className="text-gray-600 mb-4">
          {task.description || "No description"}
        </p>

        <TaskToggle checked={task.isCompleted} onChange={toggleTask} />

        {/* AUDIO */}
        {task.recordings?.length > 0 && (
          <div className="mt-5">
            <h4 className="font-semibold mb-2">Voice Notes</h4>
            {task.recordings.map((rec, i) => (
              <audio key={i} controls src={rec.fileUrl} className="w-full" />
            ))}
          </div>
        )}

        {/* FILES */}
        {task.attachments?.length > 0 && (
          <div className="mt-5">
            <h4 className="font-semibold mb-2">Attachments</h4>
            {task.attachments.map((file, i) => (
              <a
                key={i}
                href={file.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="block text-purple-600 underline"
              >
                {file.fileName}
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskDetails;
