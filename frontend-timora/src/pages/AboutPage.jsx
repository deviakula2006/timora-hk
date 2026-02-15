import { useNavigate } from "react-router-dom";

function AboutPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      {/* ===== TOP BAR ===== */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="bg-white/60 backdrop-blur-md px-4 py-2 rounded-xl shadow hover:bg-white transition"
        >
          ← Back
        </button>
      </div>

      {/* ===== MAIN CARD ===== */}
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-lg rounded-3xl shadow-xl p-10">
        {/* ===== TITLE ===== */}
        <h1 className="text-3xl font-bold text-purple-700 mb-6">
          About Timora ⏳
        </h1>

        {/* ===== INTRO ===== */}
        <p className="text-gray-700 leading-relaxed mb-6">
          <span className="font-semibold text-purple-700">Timora</span> is a
          smart productivity and task-management platform designed to help you
          organize your daily life efficiently. It allows you to create, manage,
          track, and analyze your tasks in a structured and visually engaging
          way.
        </p>

        {/* ===== HOW TO USE ===== */}
        <h2 className="text-xl font-semibold text-purple-700 mb-4">
          🚀 How to Use Timora Efficiently
        </h2>

        <ul className="space-y-3 text-gray-700 mb-8">
          <li className="bg-purple-50 border border-purple-100 rounded-xl p-4">
            📌 <span className="font-semibold">Plan Daily Tasks</span><br />
            Add tasks every morning to clearly define your goals for the day.
          </li>

          <li className="bg-purple-50 border border-purple-100 rounded-xl p-4">
            ⏰ <span className="font-semibold">Track Completion</span><br />
            Mark tasks as completed to monitor productivity progress.
          </li>

          <li className="bg-purple-50 border border-purple-100 rounded-xl p-4">
            📅 <span className="font-semibold">Use Calendar View</span><br />
            Analyze workload distribution across dates.
          </li>

          <li className="bg-purple-50 border border-purple-100 rounded-xl p-4">
            📎 <span className="font-semibold">Attach Files & Recordings</span><br />
            Keep all related resources connected to your tasks.
          </li>

          <li className="bg-purple-50 border border-purple-100 rounded-xl p-4">
            🎯 <span className="font-semibold">Stay Consistent</span><br />
            Small consistent task completion builds long-term discipline.
          </li>
        </ul>

        {/* ===== MISSION ===== */}
        <h2 className="text-xl font-semibold text-purple-700 mb-4">
          🌟 Our Mission
        </h2>

        <p className="text-gray-700 leading-relaxed mb-10">
          Timora aims to transform productivity into a mindful, structured, and
          stress-free experience. By combining task tracking with clarity and
          reflection, it empowers users to grow both personally and
          professionally.
        </p>

        {/* ===== DESIGN CREDIT ===== */}
        <div className="border-t border-purple-200 pt-6">
          <h3 className="text-lg font-semibold text-purple-700 mb-3">
            Designed & Developed By 💜
          </h3>

          <p className="text-gray-800 font-semibold">
            Devi Ganga Bhavani
          </p>

          {/* LINKS */}
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <a
              href="https://linkedin.com/in/devi-ganga-bhavani-akula-192065291/"
              target="_blank"
              rel="noreferrer"
              className="
                bg-blue-500 text-white
                px-4 py-2 rounded-xl shadow
                hover:bg-blue-600 transition
                text-center
              "
            >
              🔗 LinkedIn Profile
            </a>

            <a
              href="https://github.com/deviakula2006"
              target="_blank"
              rel="noreferrer"
              className="
                bg-gray-800 text-white
                px-4 py-2 rounded-xl shadow
                hover:bg-black transition
                text-center
              "
            >
              💻 GitHub Profile
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;