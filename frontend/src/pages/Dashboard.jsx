import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-3xl mb-6">Kaalchakra 🪐</h1>
      <button
        onClick={() => navigate("/chat")}
        className="px-6 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500"
      >
        Message Ara
      </button>
    </div>
  );
}
