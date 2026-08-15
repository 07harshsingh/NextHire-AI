import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function EditInterview(){

    const {id} = useParams();
    const navigate = useNavigate();

    const [editInterview, setEditInterview] = useState({
        title : "" ,
        role : "" ,
        experience : "" ,
        technologies : "" ,
        description : "" ,
        difficulty : "" ,
        questionCount : 10 
        });

    const handleChange = (e) => {
        setEditInterview({...editInterview, [e.target.name] : e.target.value})
    }

    const getInterview = async () => {
        try{
          const response = await api.get(`/interview/${id}`)
          setEditInterview({
                ...response.data.data,
                technologies: response.data.data.technologies.join(", ")
            });
        }catch(err){
           alert(err.response?.data?.message || "Something went wrong")
        }
    }

    useEffect(() => {
        getInterview();
    },[])

    const handleForm = async (e) => {
        e.preventDefault();
        try{
            const payload = {...editInterview,
                             technologies : editInterview.technologies
                             .split(",")
                             .map((item) => item.trim())
            }
            const response = await api.put(`/interview/${id}`, payload);
            alert(response.data.message)
            navigate("/dashboard")
        }catch(err){
            alert(err.response?.data?.message || err.message ||  "Something went wrong")
        }
    };
     return (
  <div className="min-h-screen bg-[#08090b] px-4 py-10 text-white">
    <div className="mx-auto max-w-3xl">

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Edit Interview
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Update your interview settings and questions
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#141518] p-6 shadow-2xl sm:p-8">
        <form onSubmit={handleForm} className="space-y-6">

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Interview Title
            </label>
            <input
              value={editInterview.title}
              onChange={handleChange}
              name="title"
              type="text"
              placeholder="e.g. MERN Stack Interview"
              className="w-full rounded-xl border border-white/10 bg-[#0b0c0f] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid gap-6 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Role
              </label>
              <input
                value={editInterview.role}
                onChange={handleChange}
                name="role"
                type="text"
                placeholder="e.g. Full Stack Developer"
                className="w-full rounded-xl border border-white/10 bg-[#0b0c0f] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Experience
              </label>
              <input
                value={editInterview.experience}
                onChange={handleChange}
                name="experience"
                type="text"
                placeholder="e.g. Fresher"
                className="w-full rounded-xl border border-white/10 bg-[#0b0c0f] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Technologies
            </label>
            <input
              value={editInterview.technologies}
              onChange={handleChange}
              name="technologies"
              type="text"
              placeholder="e.g. React, Node.js, MongoDB"
              className="w-full rounded-xl border border-white/10 bg-[#0b0c0f] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
            <p className="mt-2 text-xs text-gray-500">
              Separate technologies with commas
            </p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              value={editInterview.description}
              onChange={handleChange}
              name="description"
              placeholder="Describe what this interview should focus on..."
              rows="5"
              className="w-full resize-none rounded-xl border border-white/10 bg-[#0b0c0f] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            ></textarea>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Difficulty
              </label>
              <select
                value={editInterview.difficulty}
                onChange={handleChange}
                name="difficulty"
                className="w-full rounded-xl border border-white/10 bg-[#0b0c0f] px-4 py-3 text-white outline-none transition focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Question Count
              </label>
              <input
                value={editInterview.questionCount}
                onChange={handleChange}
                name="questionCount"
                type="text"
                placeholder="e.g. 5"
                className="w-full rounded-xl border border-white/10 bg-[#0b0c0f] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-500 px-6 py-3.5 font-semibold text-black transition hover:bg-emerald-400 active:scale-[0.99]"
          >
            Save Interview
          </button>

        </form>
      </div>

    </div>
  </div>
)
}

export default EditInterview;