import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Loader from "../components/common/Loader";
import Toast from "../components/common/Toast";

function Dashboard(){

    const navigate = useNavigate();

    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("")

    const [toast, setToast] = useState({
        show : false,
        message : "",
        type : "success"
    })

    const handleToastClose = useCallback(() => {
        setToast({
            show:false,
            message:"",
            type:"success"
        })
    },[])

    const getInterviews = async () => {
        try{
            setLoading(true);
            setError("")
            const response = await api.get("/interview/");    
            setInterviews(response.data.data);
        }catch(err){
             setError(err.response?.data?.message || err.message || "Something went wrong while starting the interview")
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        getInterviews()
    },[])

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this interview?");
        if (!confirmDelete) return;
        try{
            const response = await api.delete(`/interview/${id}`);
            setToast({
              show: true,
              message: response.data.message,
              type: "success"
              });
            getInterviews();
        }catch(err){
            alert(err.response?.data?.message || "Something went wrong")
        }
    };

    if(loading){
        return <Loader/>
    }
    return (
    <div className="min-h-screen bg-[#09090b] px-6 py-10 text-white">
        {toast.show && (
            <Toast
            message={toast.message}
            type={toast.type}
            onClose={handleToastClose}
            />
        )}

        <div className="mx-auto max-w-6xl">

            {/* Header */}
            <div className="mb-12 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

                <div className="max-w-2xl">
                    <p className="mb-2 text-sm font-medium tracking-wide text-emerald-400">
                        Welcome to NextHire
                    </p>

                    <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
                        Your Interview Dashboard
                    </h1>

                    <p className="mt-4 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
                        Practice technical interviews with AI-powered questions,
                        real-time feedback, and detailed performance analysis.
                    </p>
                </div>

                <div className="flex flex-wrap gap-3">

                    <button
                        onClick={() => navigate("/myprofile")}
                        className="rounded-xl border border-white/10 bg-[#141518] px-4 py-2.5 font-medium text-gray-300 transition hover:border-white/20 hover:bg-[#1b1c20] hover:text-white"
                    >
                        My Profile
                    </button>

                    <button
                        onClick={() => navigate("/create-interview")}
                        className="rounded-xl bg-emerald-500 px-4 py-2.5 font-semibold text-black transition hover:bg-emerald-400"
                    >
                        + Create Interview
                    </button>

                    <button
                        onClick={() => navigate("/results")}
                        className="rounded-xl border border-white/10 bg-[#141518] px-4 py-2.5 font-medium text-gray-300 transition hover:border-white/20 hover:bg-[#1b1c20] hover:text-white"
                    >
                        Result History
                    </button>

                </div>
            </div>


            {/* Interviews Section */}
            <div className="mb-6">
                <div className="flex items-end justify-between gap-4">

                    <div>
                        <h2 className="text-2xl font-semibold tracking-tight">
                            Your Interviews
                        </h2>

                        <p className="mt-1.5 text-sm text-gray-500">
                            Start, edit or manage your technical interviews.
                        </p>
                    </div>

                    <span className="hidden rounded-full border border-white/10 bg-[#141518] px-3 py-1 text-xs text-gray-400 sm:block">
                        {interviews.length}{" "}
                        {interviews.length === 1 ? "Interview" : "Interviews"}
                    </span>

                </div>
            </div>


            {/* Interview Cards */}
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">

                {interviews.map((item) => (

                    <div
                        key={item._id}
                        className="group rounded-2xl border border-white/10 bg-[#141518] p-6 transition duration-200 hover:-translate-y-1 hover:border-emerald-500/30 hover:shadow-lg hover:shadow-emerald-500/5"
                    >

                        {/* Card Header */}
                        <div className="mb-6 flex items-start justify-between gap-3">

                            <div>
                                <p className="mb-1 text-xs font-medium uppercase tracking-wider text-gray-500">
                                    Interview
                                </p>

                                <h3 className="text-xl font-semibold tracking-tight">
                                    {item.title}
                                </h3>
                            </div>

                            <span className="shrink-0 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-400">
                                {item.status}
                            </span>

                        </div>


                        {/* Interview Details */}
                        <div className="mb-7 space-y-3 text-sm">

                            <p>
                                <span className="text-gray-500">
                                    Role
                                </span>

                                <span className="ml-2 text-gray-200">
                                    {item.role}
                                </span>
                            </p>

                            <p>
                                <span className="text-gray-500">
                                    Difficulty
                                </span>

                                <span className="ml-2 text-gray-200">
                                    {item.difficulty}
                                </span>
                            </p>

                            <p>
                                <span className="text-gray-500">
                                    Status
                                </span>

                                <span className="ml-2 text-gray-200">
                                    {item.status}
                                </span>
                            </p>

                        </div>


                        {/* Actions */}
                        <div className="flex gap-2">

                            {item.status === "Completed" ? (

                                <button
                                    onClick={() => navigate(`/result/${item._id}`)}
                                    className="flex-1 rounded-xl bg-emerald-500 px-3 py-2.5 font-medium text-black transition hover:bg-emerald-400"
                                >
                                    View Result
                                </button>

                            ) : (

                                <>
                                    <button
                                        onClick={() => navigate(`/interview/${item._id}`)}
                                        className="flex-1 rounded-xl bg-emerald-500 px-3 py-2.5 font-medium text-black transition hover:bg-emerald-400"
                                    >
                                        Start
                                    </button>

                                    <button
                                        onClick={() => navigate(`/edit-interview/${item._id}`)}
                                        className="flex-1 rounded-xl bg-[#242529] px-3 py-2.5 font-medium text-gray-300 transition hover:bg-[#2d2f34] hover:text-white"
                                    >
                                        Edit
                                    </button>
                                </>

                            )}

                            <button
                                onClick={() => handleDelete(item._id)}
                                className="flex-1 rounded-xl bg-red-500/10 px-3 py-2.5 font-medium text-red-400 transition hover:bg-red-500/20"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                ))}

            </div>


            {/* Empty State */}
            {interviews.length === 0 && (

                <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-[#101114] px-6 py-20 text-center">

                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-[#18191d] text-2xl">
                        +
                    </div>

                    <h3 className="mt-5 text-lg font-semibold">
                        No interviews yet
                    </h3>

                    <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                        Create your first technical interview and start
                        practicing with AI-powered questions.
                    </p>

                    <button
                        onClick={() => navigate("/create-interview")}
                        className="mt-6 rounded-xl bg-emerald-500 px-5 py-2.5 font-semibold text-black transition hover:bg-emerald-400"
                    >
                        Create Interview
                    </button>

                </div>

            )}

        </div>

    </div>
)     
}
export default Dashboard;