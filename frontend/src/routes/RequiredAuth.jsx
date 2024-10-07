import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { useContext } from 'react';

const RequiredAuth = ({ allowedRoles }) => {
    const { roles, signed } = useContext(AuthContext);
    const location = useLocation();
    
    if (signed && roles.some(role => allowedRoles.includes(role.roleName))) {
        return <Outlet />;
    }
    
        console.log('Usuário autenticado:', signed);
        console.log('Papeis do usuário:', roles);
        console.log('Papeis permitidos para a rota:', allowedRoles);


    if (signed) {
        console.log(`Acesso não autorizado à rota: ${location.pathname}`);
        return <Navigate to="/unauthorized" state={{ from: location }} replace />;
    }

    return <Navigate to="/login" replace />;
};

export default RequiredAuth;
