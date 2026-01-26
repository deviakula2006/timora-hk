import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ViewAllTasks from "./pages/ViewAllTasks";
import TaskDetails from "./pages/TaskDetails";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/tasks" element={<ViewAllTasks />} />
        <Route path="/tasks/:id" element={<TaskDetails />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
