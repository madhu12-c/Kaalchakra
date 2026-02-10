import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white overflow-hidden">
      {/* background glow */}
      <div className="absolute w-[500px] h-[500px] bg-purple-600/20 blur-3xl rounded-full -top-40 -left-40" />
      <div className="absolute w-[400px] h-[400px] bg-indigo-600/20 blur-3xl rounded-full bottom-0 right-0" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col items-center gap-6"
      >
        {/* title */}
        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-semibold tracking-wide"
        >
          Kaalchakra 🪐
        </motion.h1>

        {/* subtitle */}
        <p className="text-slate-400 text-sm">
          Ancient astrology, modern intelligence
        </p>

        {/* mode selection buttons */}
        <div className="flex gap-4 mt-4">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              localStorage.setItem("responseMode", "text");
              navigate("/chat");
            }}
            className="px-6 py-3 rounded-full bg-slate-800 hover:bg-slate-700 font-medium"
          >
            Text Chat
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              localStorage.setItem("responseMode", "voice");
              navigate("/chat");
            }}
            className="px-6 py-3 rounded-full bg-indigo-600 hover:bg-indigo-500 font-medium"
          >
            Voice Chat
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
