import { Mail, Lock } from "lucide-react";
import DarkCard from "../components/workspace/DarkCard";
import { useState } from "react";
export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  
  return (
    <div className="min-h-screen w-full bg-black flex items-center justify-center">
      <DarkCard>
                <h1 className="text-center text-white text-xl font-semibold">
          Welcome!
        </h1>
        <h1 className="text-center text-white text-lg font-medium">
          Please sign in to your account
        </h1>
        <form onSubmit={handleSubmit} className="mt-6 space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email address"
              className="w-full rounded-lg bg-[#1a1a1d] border border-white/10 py-2.5 pl-10 pr-3 text-sm text-gray-200 placeholder:text-gray-500 outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full rounded-lg bg-[#1a1a1d] border border-white/10 py-2.5 pl-10 pr-3 text-sm text-gray-200 placeholder:text-gray-500 outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-[#2f80f2] hover:bg-[#2569d1] active:bg-[#1f5cb8] py-2.5 text-sm font-medium text-white transition-colors"
          >
            Login
          </button>
        </form>
      </DarkCard>
    </div>
  );
}