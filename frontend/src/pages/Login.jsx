import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { loginUser } from "../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await loginUser(email, password);
      localStorage.setItem("token", res.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#05070d] text-white">
      <div className="w-[380px] bg-[#0b0f1a]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/10">
        <h2 className="text-2xl font-semibold text-center">The stars are aligned.</h2>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-[#0f1424] border border-white/10 rounded-lg px-4 py-3"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-[#0f1424] border border-white/10 rounded-lg px-4 py-3"
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
            Enter the Cosmos 🚀
          </button>
        </form>

        <p className="text-sm text-center text-gray-400 mt-6">
          No account? <Link to="/register" className="text-blue-400">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
