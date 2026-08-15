import { useCallback, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Toast from "../components/common/Toast";

function Login(){

    const navigate = useNavigate()

    const [user, setUser] = useState({
        email : "",
        password : ""
    })

    const [isVisible, setisVisible] = useState(false);
     
    const handleChange = (e) => {
        setUser({...user, [e.target.name] : e.target.value})
    }

    const handleLogin = async (e) => {
        e.preventDefault();
        try{
            const response = await api.post("/auth/login", user);
            localStorage.setItem("token", response.data.token);
            alert(response?.data?.message || "Login successfull")
            navigate("/dashboard");
        }catch(err){
            alert(err.response?.data?.message || "Login failed. Please try again")
        } 
    };

    const handleVisibleBtn = () => {
        setisVisible(!isVisible)
    }

    return (
        <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center">

            {/* Logo / Heading */}
            <div className="text-center mt-16 mb-9">
                <h1 className="text-4xl font-bold tracking-tight">
                    NextHire
                </h1>

                <p className="text-[#8b9bb4] mt-2">
                    AI-powered technical interviews
                </p>
            </div>

            {/* Login Card */}
            <div className="w-full max-w-125 bg-[#17171a] border border-[#29292d] rounded-3xl p-9 shadow-2xl">

                <h2 className="text-3xl font-bold mb-2">
                    Welcome back
                </h2>

                <p className="text-[#9b9ba3] mb-9">
                    Sign in to continue to your dashboard.
                </p>

                <form onSubmit={handleLogin}>

                    {/* Email */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold mb-2">
                            Email
                        </label>

                        <input
                            type="text"
                            value={user.email}
                            onChange={handleChange}
                            name="email"
                            placeholder="Enter your email"
                            className="w-full h-14 px-4 rounded-xl bg-[#09090b] border border-[#3a3a40] text-white placeholder-[#66666f] outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-7">
                        <label className="block text-sm font-semibold mb-2">
                            Password
                        </label>

                        <div className="relative">
                          <input
                           type={isVisible ? "text" : "password"}
                           value={user.password}
                           onChange={handleChange}
                           name="password"
                           placeholder="Enter your password"
                           className="w-full h-14 px-4 pr-20 rounded-xl bg-[#09090b] border border-[#3a3a40] text-white placeholder-[#66666f] outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                           />
                       <button
                        type="button"
                        onClick={handleVisibleBtn}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-emerald-400 transition"
                        >
                        {isVisible ? "Hide" : "Show"}
                        </button>
                       </div>
                    </div>

                    {/* Login */}
                    <button
                        type="submit"
                        className="w-full h-14 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-lg transition shadow-lg shadow-emerald-500/10"
                    >
                        Login
                    </button>

                </form>

                {/* Register */}
                <div className="border-t border-[#29292d] mt-7 pt-7 text-center text-[#9b9ba3]">
                    Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="text-emerald-400 hover:text-emerald-300 font-semibold"
                    >
                        Register
                    </Link>
                </div>
            </div>

            <p className="text-[#4d4d55] text-sm mt-7">
                Secure access to your interview workspace
            </p>

        </div>
    );

}

export default Login;