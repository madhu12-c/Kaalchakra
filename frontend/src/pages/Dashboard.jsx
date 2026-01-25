import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../utils/auth";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-3xl mb-4">Welcome to Kaalchakra 🪐</h1>
      <button
        onClick={() => { logout(); navigate("/login"); }}
        className="px-6 py-2 bg-red-500 rounded"
      >
        Logout
      </button>
    </div>
  );
}
