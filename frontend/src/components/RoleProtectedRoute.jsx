import { Navigate } from "react-router-dom"
import useUserStore from "../store/useUserStore"


const RoleProtectedRoute = ({ allowed_roles, children }) => {
    const userRole = useUserStore((state) => state.userRole)
    

    if (!userRole) {
        return <Navigate to="/login" replace />
    }

    if (!allowed_roles.includes(userRole)) {
        return <Navigate to="/*" replace />
    }

    return children;
}

export default RoleProtectedRoute;