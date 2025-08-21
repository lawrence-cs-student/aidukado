import { Navigate } from "react-router-dom"
import useUserRoleStore from "../store/storeUserRole"


const RoleProtectedRoute = ({ allowed_roles, children }) => {
    const userRole = useUserRoleStore((state) => state.userRole)

    if (!userRole) {
        return <Navigate to="/login" replace />
    }

    if (!allowed_roles.includes(userRole)) {
        return <Navigate to="/dashboard" replace />
    }

    return children;
}

export default RoleProtectedRoute;