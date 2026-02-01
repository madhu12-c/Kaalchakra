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

        {/* button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/chat")}
          className="mt-4 px-8 py-3 rounded-full
                     bg-gradient-to-r from-indigo-500 to-purple-600
                     shadow-lg shadow-purple-600/30
                     font-medium"
        >
          Message Ara
        </motion.button>
      </motion.div>
    </div>
  );
}
