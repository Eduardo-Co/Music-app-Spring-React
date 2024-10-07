import { createContext, useEffect, useState } from "react";
import { api } from '../axios/api';

export const AuthContext = createContext();

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [expiresIn, setExpiresIn] = useState(null);
    const [loading, setLoading] = useState(true);
    const [roles, setRoles] = useState([]); 
    const [signed, setSigned] = useState(false); 
    const [errors, setErrors] = useState('')

    useEffect(() => {
        const checkUserLoggedIn = async () => {
            setLoading(true); 
            try {
                const response = await api.get('auth/user-info'); 
                if (response.status === 200) {
                    setUser({
                        userId: response.data.userId,
                        username: response.data.userName,
                        email: response.data.email,
                    });
                    setExpiresIn(response.data.expiresIn);
                    setRoles(response.data.roles); 
                    setSigned(true)
                } else {
                    console.log('Response not OK:', response);
                }
            } catch (error) {
                console.log('Error during user info fetch:', error); 
                setUser(null);
                setExpiresIn(null);
                setRoles(null);
            } finally {
                setLoading(false);
            }
        };
        
        checkUserLoggedIn();
    }, []);

    const signIn = async (email, password) => {
        setLoading(true);
        try {
            const response = await api.post('/auth/login', { email, password });
            if (response.status === 200) {
                setUser(response.data.userId);
                setExpiresIn(response.data.expiresIn);
                setRoles(response.data.roles);
                setSigned(true)
            }
        } catch (error) {
            setErrors(error.response.data)
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const signInAdmin = async (email, password) => {
       
        try{
            const response = await api.post('/auth/admin-login', { email, password });
            console.log(response)
            if (response.status === 200) {
                setUser(response.data.userId);
                setExpiresIn(response.data.expiresIn);
                setRoles(response.data.roles);
                setSigned(true)
            }
        }catch(error){
            throw error
        }
    };

    const signOut = async () => {
        setLoading(true);
        try {
            await api.post('/auth/logout');
            setUser(null);
            setExpiresIn(null);
            setRoles(null);
            setSigned(false)

        } catch (error) {
            console.log('Logout error:', error);
        } finally {
            setLoading(false);
        }
    };

    const refreshToken = async () => {
        setLoading(true);
        try {
            const response = await api.get('/auth/refresh-token');
            if (response.status === 200) {
                setUser(response.data.userId);
                setExpiresIn(response.data.expiresIn);
            }
        } catch (error) {
            console.log('Error during token refresh:', error); 
            setUser(null);
            setExpiresIn(null);
            setRoles(null);
            setSigned(true)

        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            expiresIn, 
            signed, 
            signIn, 
            signOut, 
            refreshToken, 
            roles,
            signInAdmin,
            loading,
            errors
        }}>

        {!loading? children : ''}

        </AuthContext.Provider>
    );
};

export default AuthProvider;
