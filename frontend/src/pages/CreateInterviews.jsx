import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function CreateInterviews(){

    const navigate = useNavigate()

    const [createInterview, setCreateInterview] = useState({
    title : "" ,
    role : "" ,
    experience : "" ,
    technologies : "" ,
    description : "" ,
    difficulty : "Easy" ,
    questionCount : 10 
    });

    const handleChange = (e) => {
        setCreateInterview({...createInterview, [e.target.name] : e.target.value})
    };

    const handleForm = async (e) => {
        e.preventDefault();
        try{
           const payload = {...createInterview, 
                        technologies : createInterview.technologies
                        .split(",")
                        .map((item) => item.trim())
                        }
           const response = await api.post("/interview/", payload);
           alert(response.data.message);
           navigate("/dashboard")
        }catch(err){
           console.log(err);

    alert(
        err.response?.data?.message ||
        err.message ||
        "Something went wrong"
    );
        }
    };

    return (
  <div className="min-h-screen bg-[#08090b] px-4 py-10 text-white">
    <div className="mx-auto max-w-3xl">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Create Interview
        </h1>
        <p className="mt-2 text-sm text-gray-400">
          Set up your AI-powered technical interview
        </p>
      </div>

      {/* Form Card */}
      <div className="rounded-2xl border border-white/10 bg-[#141518] p-6 shadow-2xl sm:p-8">
        <form onSubmit={handleForm} className="space-y-6">

          {/* Title */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Interview Title
            </label>
            <input
              value={createInterview.title}
              onChange={handleChange}
              name="title"
              type="text"
              placeholder="e.g. MERN Stack Interview"
              className="w-full rounded-xl border border-white/10 bg-[#0b0c0f] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Role + Experience */}
          <div className="grid gap-6 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Role
              </label>
              <input
                value={createInterview.role}
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
                value={createInterview.experience}
                onChange={handleChange}
                name="experience"
                type="text"
                placeholder="e.g. Fresher"
                className="w-full rounded-xl border border-white/10 bg-[#0b0c0f] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

          </div>

          {/* Technologies */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Technologies
            </label>
            <input
              value={createInterview.technologies}
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

          {/* Description */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-300">
              Description
            </label>
            <textarea
              value={createInterview.description}
              onChange={handleChange}
              name="description"
              placeholder="Describe what this interview should focus on..."
              rows="5"
              className="w-full resize-none rounded-xl border border-white/10 bg-[#0b0c0f] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
            ></textarea>
          </div>

          {/* Difficulty + Question Count */}
          <div className="grid gap-6 sm:grid-cols-2">

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Difficulty
              </label>
              <select
                value={createInterview.difficulty}
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
                value={createInterview.questionCount}
                onChange={handleChange}
                name="questionCount"
                type="text"
                placeholder="e.g. 5"
                className="w-full rounded-xl border border-white/10 bg-[#0b0c0f] px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500"
              />
            </div>

          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-500 px-6 py-3.5 font-semibold text-black transition hover:bg-emerald-400 active:scale-[0.99]"
          >
            Create Interview
          </button>

        </form>
      </div>

    </div>
  </div>
)
}

export default CreateInterviews;