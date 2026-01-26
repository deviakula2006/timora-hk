import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TaskToggle from "../components/TaskToggle";

function ViewAllTasks() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:9000/api/todo", {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    setTasks(data);
  };

  const toggleTask = async (id) => {
    await fetch(`http://localhost:9000/api/todo/complete/${id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-2xl font-bold text-purple-700 mb-4">
        All Tasks
      </h2>

      {/* SEARCH */}
      <input
        type="text"
        placeholder="Search tasks..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 rounded-xl border mb-5"
      />

      {filteredTasks.length === 0 ? (
        <div className="bg-white p-6 rounded-xl text-center text-gray-500">
          No tasks found
        </div>
      ) : (
        <div className="space-y-3">
          {filteredTasks.map(task => (
            <div
              key={task._id}
              className="bg-white p-4 rounded-xl shadow flex justify-between items-center cursor-pointer"
              onClick={() => navigate(`/tasks/${task._id}`)}
            >
              <p
                className={`font-medium ${
                  task.isCompleted ? "line-through text-gray-400" : ""
                }`}
              >
                {task.title}
              </p>

              <div
                onClick={(e) => {
                  e.stopPropagation();
                  toggleTask(task._id);
                }}
              >
                <TaskToggle checked={task.isCompleted} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ViewAllTasks;
