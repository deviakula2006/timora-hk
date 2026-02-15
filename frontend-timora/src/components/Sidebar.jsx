import { NavLink, useNavigate } from "react-router-dom";

function Sidebar() {

  const navigate = useNavigate();

  /* ===== MENU ===== */
  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: "🏠" },
    { name: "All Tasks", path: "/tasks", icon: "📋" },
    { name: "Completed Tasks", path: "/completed", icon: "✅" },
    { name: "Todo Tasks", path: "/todo", icon: "📝" },
    { name: "Calendar", path: "/calendar", icon: "📅" },
    { name: "About", path: "/about", icon: "ℹ️" },
    
  ];

  /* ===== LOGOUT FUNCTION ===== */
  const handleLogout = () => {
    localStorage.removeItem("token");   // remove auth token
    navigate("/");                      // redirect to login
  };

  return (
    <div
      className="
        w-64 min-h-screen p-5

        bg-gradient-to-b
        from-purple-100
        via-indigo-50
        to-pink-100

        shadow-[8px_0_40px_rgba(139,92,246,0.15)]
        border-r border-white/40

        flex flex-col justify-between
      "
    >

      {/* ===== TOP SECTION ===== */}
      <div>

        {/* ===== LOGO ===== */}
        <div
          className="
            text-2xl font-bold text-purple-700
            mb-8 flex items-center gap-2
          "
        >
          🌙 Timora
        </div>

        {/* ===== MENU ===== */}
        <nav className="flex flex-col gap-3">

          {menu.map((item, i) => (
            <NavLink
              key={i}
              to={item.path}

              className={({ isActive }) => `
                flex items-center gap-3
                px-4 py-3 rounded-xl
                text-sm font-medium
                transition duration-300

                ${
                  isActive
                    ? `
                      bg-gradient-to-r
                      from-purple-400 to-indigo-300
                      text-white
                      shadow-[0_6px_20px_rgba(139,92,246,0.35)]
                    `
                    : `
                      text-gray-700
                      hover:bg-white/60
                      hover:shadow-sm
                      hover:-translate-y-0.5
                    `
                }
              `}
            >

              {/* Icon */}
              <span
                className="
                  p-2 rounded-lg
                  bg-white/70
                  shadow-sm
                  text-lg
                "
              >
                {item.icon}
              </span>

              {item.name}

            </NavLink>
          ))}

        </nav>

      </div>

      {/* ===== BOTTOM SECTION ===== */}
      <div className="space-y-4">

        {/* ===== LOGOUT BUTTON ===== */}
        <button
          onClick={handleLogout}
          className="
            w-full flex items-center gap-3
            px-4 py-3 rounded-xl
            text-sm font-medium

            text-red-600
            bg-white/60

            hover:bg-red-100
            hover:shadow-sm
            hover:-translate-y-0.5

            transition duration-300
          "
        >

          <span
            className="
              p-2 rounded-lg
              bg-white shadow-sm text-lg
            "
          >
            🚪
          </span>

          Logout

        </button>

        {/* ===== BOTTOM CARD ===== */}
        <div
          className="
            p-4 rounded-2xl
            bg-gradient-to-r
            from-purple-400 to-indigo-300
            text-white text-sm
            shadow-lg
          "
        >
          <p className="font-semibold mb-1">
            Timora Productivity 🚀
          </p>

          <p className="opacity-90 text-xs">
            Organize your tasks smarter and faster.
          </p>
        </div>

      </div>

    </div>
  );
}

export default Sidebar;
