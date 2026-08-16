import {Navigate, Outlet} from "react-router-dom";
import {useAuth} from "../providers/AuthProvider";
export function ProtectedRoute() {
    const {isAuth, loading} = useAuth();
    if (loading) {
        return <div>Loading...</div>;
    }
    return isAuth ? <Outlet/> : <Navigate to="/login"/>;
}
export function GuestRoute() {
    const {isAuth, loading} = useAuth();
    if (loading) {
        return <div>Loading...</div>;
    }
    return !isAuth ? <Outlet/> : <Navigate to="/"/>;
}