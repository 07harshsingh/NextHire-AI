import { useCallback, useState } from "react";
import api from "../services/api"
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Toast from "../components/common/Toast";

function Register(){

    const navigate = useNavigate()

    const [registerUser, setRegisterUser] = useState({
        username : "",
        email : "",
        password : "",
        confirmPassword : ""
    })

    const [isVisible, setisVisible] = useState(false);
    const [isVisibleConfirm, setisVisibleConfirm] = useState(false)

    const handleChange = (e) => {
        setRegisterUser({...registerUser, [e.target.name] : e.target.value});
    }

    const handleRegister = async (e) => {
        e.preventDefault();
        try{
            const response = await api.post("/auth/register", registerUser);
            alert(response.data.message)
            navigate("/login");
        }catch(err){
            alert(err.response.data.message);
        }
    };

     const handleVisibleBtn = () => {
        setisVisible(!isVisible);
    }
    const handleConfirmVisibleBtn = () => {
        setisVisibleConfirm(!isVisibleConfirm)
    }

    return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col items-center">

        <div className="text-center mt-16 mb-9">
            <h1 className="text-4xl font-bold tracking-tight">
                NextHire
            </h1>

            <p className="text-[#8b9bb4] mt-2">
                AI-powered technical interviews
            </p>
        </div>

        <div className="w-full max-w-125 bg-[#17171a] border border-[#29292d] rounded-3xl p-9 shadow-2xl">

            <h2 className="text-3xl font-bold mb-2">
                Create your account
            </h2>

            <p className="text-[#9b9ba3] mb-9">
                Register to start your interview journey.
            </p>

            <form onSubmit={handleRegister}>

                <div className="mb-5">
                    <label className="block text-sm font-semibold mb-2">
                        Username
                    </label>

                    <input
                        type="text"
                        value={registerUser.username}
                        onChange={handleChange}
                        name="username"
                        placeholder="Enter your username"
                        className="w-full h-14 px-4 rounded-xl bg-[#09090b] border border-[#3a3a40] text-white placeholder-[#66666f] outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-semibold mb-2">
                        Email
                    </label>

                    <input
                        type="text"
                        value={registerUser.email}
                        onChange={handleChange}
                        name="email"
                        placeholder="Enter your email"
                        className="w-full h-14 px-4 rounded-xl bg-[#09090b] border border-[#3a3a40] text-white placeholder-[#66666f] outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                    />
                </div>

                <div className="mb-5">
                    <label className="block text-sm font-semibold mb-2">
                        Password
                    </label>

                    <div className="relative">
                          <input
                           type={isVisible ? "text" : "password"}
                           value={registerUser.password}
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

                <div className="mb-7">
                    <label className="block text-sm font-semibold mb-2">
                        Confirm Password
                    </label>

                    <div className="relative">
                          <input
                           type={isVisibleConfirm ? "text" : "password"}
                           value={registerUser.confirmPassword}
                           onChange={handleChange}
                           name="confirmPassword"
                           placeholder="Enter your confirm password"
                           className="w-full h-14 px-4 pr-20 rounded-xl bg-[#09090b] border border-[#3a3a40] text-white placeholder-[#66666f] outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                           />
                       <button
                        type="button"
                        onClick={handleConfirmVisibleBtn}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-400 hover:bg-white/5 hover:text-emerald-400 transition"
                        >
                        {isVisibleConfirm ? "Hide" : "Show"}
                        </button>
                       </div>
                </div>

                <button
                    type="submit"
                    className="w-full h-14 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-lg transition shadow-lg shadow-emerald-500/10"
                >
                    Register
                </button>

            </form>

            <div className="border-t border-[#29292d] mt-7 pt-7 text-center text-[#9b9ba3]">
                Have an account?{" "}
                <Link
                    to="/login"
                    className="text-emerald-400 hover:text-emerald-300 font-semibold"
                >
                    Login
                </Link>
            </div>

        </div>

        <p className="text-[#4d4d55] text-sm mt-7">
            Create your secure interview workspace
        </p>

    </div>
)

}

export default Register;