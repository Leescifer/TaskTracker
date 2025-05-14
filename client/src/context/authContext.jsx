'use client';
import Loader from '@components/Loader.jsx';
import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";
import axios from 'axios';
import toast from 'react-hot-toast';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userRole, setUserRole] = useState(null);  // State to store user role
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(true);
    const [authToken, setAuthToken] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const token = Cookies.get("authToken");

        if (token) {
            setAuthToken(token);
            axios.get(`${API_URL}/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            .then(res => {
                if (res.data?.user?.role) {
                    setUser(res.data.user);
                    setUserRole(res.data.user.role);
                } else {
                    toast.error("Role information is missing.");
                    router.push("/auth");
                }
            })
            .catch(() => {
                toast.error("Session expired");
                Cookies.remove("authToken");
                router.push("/auth");
            })
            .finally(() => {
                setLoading(false);
            });
        } else {
            setLoading(false);
            router.push("/auth");
        }
    }, []);

    const signin = async (email, password) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/signin`, {
                email,
                password
            });

            if (response.data.status) {
                Cookies.set("authToken", response.data.access_token, { expires: 10 });
                setAuthToken(response.data.access_token);
                setUser(response.data.user);  // Save user data including role
                setUserRole(response.data.user.role);  // Set user role
                toast.success("Signed in successfully");
                router.push("/dashboard");
            } else {
                toast.error("Invalid sign-in details");
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Sign-in failed');
        } finally {
            setLoading(false);
        }
    };

    const signup = async (email, password, name, role) => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/signup`, {
                email,
                password,
                name,
                role
            });

            if (response.data.status) {
                Cookies.set("authToken", response.data.access_token, { expires: 10 });
                setAuthToken(response.data.access_token);
                setUser(response.data.user);  // Save user data including role
                setUserRole(response.data.user.role);  // Set user role
                toast.success('Signed up successfully');
                router.push('/dashboard');
            } else {
                toast.error('Sign-up failed');
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || 'Sign-up failed');
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await axios.post(`${API_URL}/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
        } catch (_) {
            // Ignore failure but continue logout
        } finally {
            setAuthToken(null);
            setUser(null);  // Clear user data
            setUserRole(null);  // Clear user role
            Cookies.remove("authToken");
            toast.success('Logged out');
            router.push('/auth');
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            userRole,  // Provide userRole to the rest of the app
            signin,
            signup,
            logout,
            isLogin,
            loading,
            setIsLogin,
            authToken
        }}>
            {loading ? <Loader /> : children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
