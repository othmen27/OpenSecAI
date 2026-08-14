import { Mail, Lock } from "lucide-react";
import DarkCard from "../components/workspace/DarkCard";
import { useNavigate} from 'react-router-dom';
import {useAuth} from "../providers/AuthProvider";
import {useForm} from 'react-hook-form'
type LoginForm = {
  username: string;
  password: string;
}
export default function LoginPage() {
  // @ts-expect-error
  const {register,handleSubmit,formState:{errors},reset,} = useForm<LoginForm>({defaultValues: {username: "",password:""},mode:"onTouched"}) 
  const navigate = useNavigate();
  const {login} = useAuth()
  const onSubmit = async (data: LoginForm) => {
    try{
      await login(data);
      reset();
      navigate("/", { replace: true });
    }catch(error){
      console.error(error);
    }
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
        <form onSubmit={handleSubmit(onSubmit)} className="mt-6 space-y-3">
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              {...register("username", { required: "Username is required" })}
              placeholder="Username"
              className="w-full rounded-lg bg-[#1a1a1d] border border-white/10 py-2.5 pl-10 pr-3 text-sm text-gray-200 placeholder:text-gray-500 outline-none focus:border-sky-500/50 focus:ring-1 focus:ring-sky-500/30 transition"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="password"
              {...register("password", { required: "Password is required" })}
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