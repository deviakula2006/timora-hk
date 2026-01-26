import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signupUser } from "../services/authService";

// Firebase
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../services/firebase";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Email/password signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await signupUser(email, password);
      if (res.token) {
        localStorage.setItem("token", res.token);
        navigate("/dashboard");
      }
    } catch {
      setError("Signup failed");
    }
  };

  // Google signup
  const handleGoogleSignup = async () => {
  try {
    console.log("Popup opening...");
    const result = await signInWithPopup(auth, googleProvider);
    console.log("Popup success", result.user.email);

    const res = await fetch("http://localhost:9000/api/user/google-login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: result.user.email,
        name: result.user.displayName
      })
    });

    console.log("Backend response status:", res.status);

    const data = await res.json();
    console.log("Backend data:", data);

    localStorage.setItem("token", data.token);
    navigate("/dashboard");
  } catch (err) {
    console.error("Google signup error:", err);
    setError("Google signup failed");
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-purple-600">
          Create Account
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <form onSubmit={handleSignup}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mb-4 p-2 border rounded"
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
          >
            Sign Up
          </button>
        </form>

        <div className="flex items-center my-4">
          <div className="flex-grow border-t" />
          <span className="px-3 text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t" />
        </div>

        <button
          type="button"
          onClick={handleGoogleSignup}
          className="w-full border p-2 rounded flex items-center justify-center gap-2 hover:bg-gray-50"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <Link to="/" className="text-purple-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;
