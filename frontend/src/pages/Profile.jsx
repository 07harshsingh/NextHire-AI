import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import Loader from "../components/common/Loader";
import Toast from "../components/common/Toast";

function Profile(){

    const [existProfile, setExistProfile] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [profile, setProfile] = useState({
        fullName : "",
        college : "",
        degree : "",
        skills : "",
        experience : "",
        github : "",
        linkedIn : "",
        resume : ""
    })

    const [toast, setToast] = useState({
        show:false,
        message:"",
        type:"success"
    })

    const handleToastClose = useCallback(() => {
           setToast({
            show:false,
            message:"",
            type:"success"
           })
    },[])

    const handleChange = (e) => {
        setProfile({...profile, [e.target.name] : e.target.value});
    };
    const handleResumeChange = (e) => {
        setResumeFile(e.target.files[0]);
    };

    ///Show exist profile
    const getProfile = async () => {
        try{
           const response = await api.get("/profile/me");
           const data = response.data.data
           setProfile({...data, skills: data.skills? data.skills.join(",") : ""});
           setExistProfile(true);
        }catch(err){
           alert(err.response?.data?.message || "Something went wrong")
        }finally{
            setLoading(false)
        }
    };

    useEffect(() => {
        getProfile();
    },[]);

    ///If not exist profile... Create or update profile
    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
           const payload = {
             fullName : profile.fullName,
             college : profile.college,
             degree : profile.degree,
             skills : profile.skills
                      .split(",").map((item) => item.trim()).filter((item) => item!==""),
             experience : profile.experience,
             github : profile.github,
             linkedIn : profile.linkedIn
           }

           let response;
           if(!existProfile){
              response = await api.post("/profile/", payload);
              setExistProfile(true);
           }
           else{
              response = await api.put("/profile/", payload);
           }
           setToast({
             show:true,
             message: response.data.message,
             type: "success"
           })
           getProfile();
        }catch(err){
           alert(err.response?.data?.message || "Something went wrong");
        }
    }

    const handleResumeUpload = async () => {
        if(!resumeFile){
            alert("Please selete a resume first");
            return;
        }
        try{
           const formData = new FormData();
           formData.append("resume", resumeFile);
           
           const response = await api.post("/profile/upload-resume", formData);
           
           setToast({
             show:true,
             message: response.data.message,
             type: "success"
           })
           setResumeFile(null);
           getProfile();

        }catch(err){
           alert(err.response?.data?.message || err.message || "Resume upload failed")
        }
    };

    const handleDelete = async () => {
        const confirmDelete = window.confirm("Are you sure you want to delete your?");
        if(!confirmDelete){
            return;
        }
        try{
          const response = await api.delete("/profile/");
          setToast({
             show:true,
             message: response.data.message,
             type: "success"
           })
          setExistProfile(false);
          setProfile({
            fullName : "",
            college : "",
            degree : "",
            skills : "",
            experience : "",
            github : "",
            linkedIn : "",
            resume : ""
          })
        }catch(err){
           alert(err.response?.data?.message || "Something went wrong")
        }
    };

    if(loading){
        return <Loader/>
    }

    return (
    <div className="min-h-screen bg-[#09090b] text-white px-6 py-10">
        {toast.show && (
            <Toast
            message = {toast.message}
            type = {toast.type}
            onClose = {handleToastClose}
            />
        )}

        <div className="max-w-4xl mx-auto">

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    My Profile
                </h1>

                <p className="text-[#8b9bb4] mt-1">
                    Manage your professional profile and resume
                </p>
            </div>

            {/* Profile Form */}
            <div className="bg-[#17171a] border border-[#29292d] rounded-3xl p-8">

                <h2 className="text-xl font-semibold mb-7">
                    {existProfile ? "Your Profile" : "Create Your Profile"}
                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Full Name
                            </label>

                            <input
                                value={profile.fullName}
                                onChange={handleChange}
                                name="fullName"
                                type="text"
                                placeholder="Enter your full name"
                                className="w-full h-12 px-4 rounded-xl bg-[#09090b] border border-[#3a3a40] text-white placeholder-[#66666f] outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                College
                            </label>

                            <input
                                value={profile.college}
                                onChange={handleChange}
                                name="college"
                                type="text"
                                placeholder="Enter your college"
                                className="w-full h-12 px-4 rounded-xl bg-[#09090b] border border-[#3a3a40] text-white placeholder-[#66666f] outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Degree
                            </label>

                            <input
                                value={profile.degree}
                                onChange={handleChange}
                                name="degree"
                                type="text"
                                placeholder="Enter your degree"
                                className="w-full h-12 px-4 rounded-xl bg-[#09090b] border border-[#3a3a40] text-white placeholder-[#66666f] outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                Experience
                            </label>

                            <select
                                value={profile.experience}
                                onChange={handleChange}
                                name="experience"
                                className="w-full h-12 px-4 rounded-xl bg-[#09090b] border border-[#3a3a40] text-white outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                            >
                                <option value="Fresher">Fresher</option>
                                <option value="0-1">0-1</option>
                                <option value="1-2">1-2</option>
                                <option value="2-5">2-5</option>
                                <option value="5+">5+</option>
                            </select>
                        </div>

                    </div>

                    <div className="mt-6">
                        <label className="block text-sm font-semibold mb-2">
                            Skills
                        </label>

                        <input
                            value={profile.skills}
                            onChange={handleChange}
                            name="skills"
                            placeholder="React, Node.js"
                            type="text"
                            className="w-full h-12 px-4 rounded-xl bg-[#09090b] border border-[#3a3a40] text-white placeholder-[#66666f] outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                        />

                        <small className="text-[#71717a] text-xs mt-2 block">
                            Separate skills with commas
                        </small>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                GitHub
                            </label>

                            <input
                                value={profile.github}
                                onChange={handleChange}
                                name="github"
                                placeholder="GitHub profile URL"
                                type="text"
                                className="w-full h-12 px-4 rounded-xl bg-[#09090b] border border-[#3a3a40] text-white placeholder-[#66666f] outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold mb-2">
                                LinkedIn
                            </label>

                            <input
                                value={profile.linkedIn}
                                onChange={handleChange}
                                name="linkedIn"
                                placeholder="LinkedIn profile URL"
                                type="text"
                                className="w-full h-12 px-4 rounded-xl bg-[#09090b] border border-[#3a3a40] text-white placeholder-[#66666f] outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition"
                            />
                        </div>

                    </div>

                    <button
                        type="submit"
                        className="w-full mt-8 h-12 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold transition"
                    >
                        {existProfile ? "Update Profile" : "Create Profile"}
                    </button>

                </form>
            </div>

            {/* Resume */}
            <div className="bg-[#17171a] border border-[#29292d] rounded-3xl p-8 mt-6">

                <h2 className="text-xl font-semibold mb-5">
                    Resume
                </h2>

                {profile.resume && (
                    <div className="mb-5 p-4 rounded-xl bg-[#09090b] border border-[#29292d]">
                        <p className="text-[#a1a1aa] text-sm mb-2">
                            Resume already uploaded
                        </p>

                        <a
                            href={profile.resume}
                            target="_blank"
                            rel="noreferrer"
                            className="text-emerald-400 hover:text-emerald-300 font-medium"
                        >
                            View Resume →
                        </a>
                    </div>
                )}

                <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeChange}
                    className="w-full text-sm text-[#a1a1aa] file:mr-4 file:rounded-lg file:border-0 file:bg-[#27272a] file:px-4 file:py-2 file:text-white hover:file:bg-[#323236]"
                />

                <button
                    onClick={handleResumeUpload}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold transition"
                >
                    {profile.resume ? "Replace Resume" : "Upload Resume"}
                </button>

                {existProfile && (
                    <div className="border-t border-[#29292d] mt-7 pt-6">
                        <button
                            onClick={handleDelete}
                            className="px-5 py-2.5 rounded-xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition font-medium"
                        >
                            Delete Profile
                        </button>
                    </div>
                )}

            </div>

        </div>
    </div>
)
}

export default Profile;