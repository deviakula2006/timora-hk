import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

function CalendarPage() {

  const [selectedDate, setSelectedDate] = useState(new Date());
  const navigate = useNavigate();

  /* ================= DATE CLICK ================= */
  const handleDateClick = (date) => {
    setSelectedDate(date);
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">

      {/* ===== TOP BAR ===== */}
      <div className="flex justify-between items-center mb-8">

        <button
          onClick={() => navigate(-1)}
          className="bg-white/50 backdrop-blur-md px-4 py-2 rounded-xl shadow"
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
      <h2 className="text-2xl font-semibold mb-6 text-purple-700 text-center">
        📅 Calendar
      </h2>

      {/* ===== CALENDAR CARD ===== */}
      <div className="flex justify-center">

        <div className="bg-white rounded-2xl shadow-lg p-6 w-fit">

          <Calendar
            value={selectedDate}
            onClickDay={handleDateClick}
          />

        </div>

      </div>

      {/* ===== SELECTED DATE DISPLAY ===== */}
      <div className="text-center mt-8 text-purple-700 font-semibold">

        Selected Date: <br />
        {selectedDate.toDateString()}

      </div>

    </div>
  );
}

export default CalendarPage;
