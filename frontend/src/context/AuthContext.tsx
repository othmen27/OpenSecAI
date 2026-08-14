import {createContext} from "react";
import type {LoginForm, User} from "../types/auth";
interface AuthContextType {
    user: User | null;
    isAuth: boolean;
    loading: boolean;
    refresh: () => Promise<void>;
    login: (data: LoginForm) => Promise<void>;
    logout: () => Promise<void>;
}
export const AuthContext = createContext<AuthContextType | null>(null);