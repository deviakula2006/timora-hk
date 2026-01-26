import { useNavigate } from "react-router-dom";

function Header({ title = "Timora", showBack = true }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="flex items-center justify-between mb-6">
      {/* BACK */}
      {showBack ? (
        <button
          onClick={() => navigate(-1)}
          className="text-xl font-bold text-purple-600"
        >
          ←
        </button>
      ) : (
        <div className="w-6" />
      )}

      {/* TITLE */}
      <h1 className="text-xl font-bold text-purple-700">
        {title}
      </h1>

      {/* LOGOUT */}
      <button
        onClick={handleLogout}
        className="text-sm text-red-500 font-medium"
      >
        Sign out
      </button>
    </div>
  );
}

export default Header;
