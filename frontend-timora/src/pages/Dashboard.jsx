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

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    const res = await fetch("http://localhost:9000/api/todo", {
      headers: { Authorization: `Bearer ${token}` }
    });
    setTasks(await res.json());
  };

  useEffect(() => {
    if (!token) return navigate("/");
    fetchTasks();
  }, []);

  const saveTask = async (task) => {
    const fd = new FormData();
    fd.append("title", task.title);
    fd.append("description", task.description || "");
    fd.append("isCompleted", task.isCompleted);
    task.files.forEach(f => fd.append("files", f));
    if (task.audioBlob) fd.append("audio", task.audioBlob);

    await fetch("http://localhost:9000/api/todo", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: fd
    });

    setShowForm(false);
    fetchTasks();
  };

  const updateTask = async (data) => {
    const fd = new FormData();
    fd.append("title", data.title);
    fd.append("description", data.description || "");
    fd.append("isCompleted", data.isCompleted);
    data.files.forEach(f => fd.append("files", f));
    if (data.audioBlob) fd.append("audio", data.audioBlob);
    fd.append("removedFiles", JSON.stringify(data.removedFiles));
    fd.append("removedRecordings", JSON.stringify(data.removedRecordings));

    await axios.patch(
      `http://localhost:9000/api/todo/${editTask._id}`,
      fd,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    setEditTask(null);
    fetchTasks();
  };

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-4">
      <Header title="Timora" />
      <button onClick={() => setShowForm(true)}>Add Task</button>

      {showForm && <AddTaskModal onClose={() => setShowForm(false)} onSave={saveTask} />}
      {editTask && <AddTaskModal initialData={editTask} onClose={() => setEditTask(null)} onSave={updateTask} />}

      {tasks.map(t => (
        <div key={t._id}>
          <p>{t.title}</p>
          <TaskToggle checked={t.isCompleted} />
          <button onClick={() => setEditTask(t)}>Edit</button>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;
