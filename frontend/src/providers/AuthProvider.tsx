import {useContext, useEffect, useState, useMemo} from "react";
import {AuthContext} from "../context/AuthContext";
import type {ReactNode} from "react";
import {http} from "../api/http";
import type {LoginForm, User} from "../types/auth";
export function AuthProvider({children}: {children: ReactNode}) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = async () =>{
    setLoading(true);
    try {
      const response= await http.get("/me").json<{ user: User }>();
      setUser(response.user);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }
    useEffect(() => {
        refresh();
    }, []);
    const login = async (data: LoginForm) => {
            await http.post("/login", { json: data }).json();
            await refresh();
    };
    const logout = async () => {
        try{
            await http.post("/logout").json();
        }finally{
            setUser(null);
        }
    }
    const value: any = useMemo(
        () => ({user, isAuth: !!user,loading,login,logout,refresh}),
        [user, loading]
    );
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext)
    if(!context){
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}