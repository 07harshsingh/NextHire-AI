import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/common/Loader";

function ResultHistory(){

    const navigate = useNavigate()

    const [resultHistory, setResultHistory] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const getHistory = async () => {
        try{
          setLoading(true);
          setError("");
          const response = await api.get("/interview/result/history");     
          setResultHistory(
             Array.isArray(response.data?.results) ? response.data.results
           : Array.isArray(response.data?.data) ? response.data.data
           : []
          );
        }catch(err){
            setError(err.response?.data?.message || err.message || "Something went wrong unable to show result")
        }finally{
            setLoading(false);
        }
    };

    useEffect(() => {
          getHistory()
    },[]);

    if (loading) {
    return <Loader />;
    }

return (
  <div className="min-h-screen bg-[#08090b] px-4 py-10 text-white">
    <div className="mx-auto max-w-5xl">

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Result History</h1>
        <p className="mt-2 text-gray-400">
          View your previous interview performances
        </p>
      </div>

      <button
        onClick={() => navigate("/dashboard")}
        className="mb-8 rounded-lg border border-white/10 bg-[#141518] px-4 py-2 text-sm text-gray-300 transition hover:border-emerald-500/40 hover:text-white"
      >
        ← Back to Dashboard
      </button>

      {resultHistory.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#141518] p-12 text-center">
          <h2 className="text-xl font-semibold">
            No interview results found
          </h2>

          <p className="mt-2 text-gray-500">
            Complete an interview to see your results here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">

          {resultHistory.map((interview) => (
            <div
              key={interview._id}
              className="rounded-2xl border border-white/10 bg-[#141518] p-6 transition hover:border-emerald-500/30"
            >

              <div className="mb-5 flex items-start justify-between">
                <div>
                  <p className="text-xs uppercase tracking-wider text-gray-500">
                    Interview
                  </p>

                  <h2 className="mt-1 text-lg font-semibold">
                     {interview.title}
                  </h2> 
                  <p className="text-xs tracking-wider text-gray-500">
                    {"ID: "+ interview._id}
                  </p>
                </div>

                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">
                  {interview.overallScore}/10
                </span>
              </div>

              <div className="space-y-3 text-sm">

                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-500">
                    Completed Date
                  </span>

                  <span className="text-gray-300">
                    {interview.completedDate
                      ? new Date(
                          interview.completedDate
                        ).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/5 pb-3">
                  <span className="text-gray-500">
                    Overall Score
                  </span>

                  <span className="font-semibold text-white">
                    {interview.overallScore}/10
                  </span>
                </div>

              </div>

              <button
                // onClick={() => getResult(interview._id)}
                onClick={() => navigate(`/result/${interview._id}`)}
                className="mt-6 w-full rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-black transition hover:bg-emerald-400 active:scale-[0.99]"
              >
                View Result
              </button>

            </div>
          ))}

        </div>
      )}

    </div>
  </div>
)
}

export default ResultHistory;