import '@fortawesome/fontawesome-free/css/all.min.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthProvider from './context/AuthContext.jsx'; 
import useTokenVerification from './hooks/checkAndRefreshToken'; 
import Login from './components/Login/Login';
import Register from './components/Register/Register';
import Page404 from './components/RedirectPages/Page404';
import AdminLogin from './components/Login/AdminLogin';
import AdminHome from './components/Admin/AdminHome';
import Home from './components/Home/Home'; 
import RequiredAuth from './routes/RequiredAuth';
import Page401 from './components/RedirectPages/Page401';
import './App.css';


function App() {
  useTokenVerification(); 
  const ROLES = {
    'User': 'USER',
    'Admin': 'ADMIN'
  }
  
  return ( 
    <BrowserRouter>
      <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin-login" element={<AdminLogin />} />

            {/* Rotas protegidas */}
            <Route element={<RequiredAuth allowedRoles={[ROLES.User]}/>}>
              <Route path="/home" element={<Home />} />
            </Route>

            <Route element={<RequiredAuth allowedRoles={[ROLES.Admin]}/>}>
              <Route path="/admin/home" element={<AdminHome />} />
            </Route>
            <Route path='/unauthorized' element={<Page401 />} />
            <Route path="*" element={<Page404 />} />
          </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
