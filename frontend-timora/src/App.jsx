import { BrowserRouter, Routes, Route } from "react-router-dom";
import CalendarPage from "./pages/CalendarPage";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import ViewAllTasks from "./pages/ViewAllTasks";
import TaskDetails from "./pages/TaskDetails";
import CompletedTasks from "./pages/CompletedTasks";
import TodoTasks from "./pages/TodoTasks";
import Layout from "./layouts/Layout";
import AboutPage from "./pages/AboutPage";

const Dummy = ({ title }) => (
  <div className="text-2xl font-bold">{title}</div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Auth */}
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* Dashboard */}
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />

        {/* All Tasks */}
        <Route
          path="/tasks"
          element={
            <Layout>
              <ViewAllTasks />
            </Layout>
          }
        />

        {/* Task Details */}
        <Route
          path="/task/:id"
          element={
            <Layout>
              <TaskDetails />
            </Layout>
          }
        />

        {/* ✅ Completed Tasks Page */}
        <Route
          path="/completed"
          element={
            <Layout>
              <CompletedTasks />
            </Layout>
          }
        />

        {/* Other Pages */}
        <Route
          path="/todo"
          element={
            <Layout>
              <TodoTasks />
            </Layout>
          }
        />
           {/* 📅 Calendar Page */}
<Route
  path="/calendar"
  element={
    <Layout>
      <CalendarPage />
    </Layout>
  }
/>
<Route path="/about" element={<AboutPage />} />


      </Routes>
    </BrowserRouter>
  );
}

export default App;
