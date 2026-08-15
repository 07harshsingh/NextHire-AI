import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Loader from "../components/common/Loader";

function Result(){

    const [result, setResult] = useState(null)
    const [viewLoading, setViewLoading] = useState(false)
    const [error, setError] = useState("")

    const navigate = useNavigate()

    const {id} = useParams()

      const getResult = async () => {
          try{
            setViewLoading(true);
            setError("")
            const response = await api.get(`/question/${id}/result`)
            setResult(response.data.result);
          }catch(err){
             setError(err.response?.data?.message || err.message || "Something went wrong unable to fetch result")
          }finally{
            setViewLoading(false);
          }
    };

    useEffect(() => {
      getResult(id)
    },[id])

    if(viewLoading){
      return <Loader/>
    }
    
  if (result) {
    return (
  <div className="min-h-screen bg-[#08090b] px-4 py-10 text-white">
    <div className="mx-auto max-w-5xl">

      {/* Result Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-6 rounded-lg border border-white/10 bg-[#141518] px-4 py-2 text-sm text-gray-300 transition hover:border-emerald-500/40 hover:text-white"
        >
          ← Back to dashboard
        </button>

        <h1 className="text-3xl font-bold">Interview Result</h1>
        <p className="mt-2 text-gray-400">
          Detailed performance analysis of your interview
        </p>
      </div>

      {/* Score Overview */}
      <div className="mb-6 grid gap-4 sm:grid-cols-3">

        <div className="group rounded-2xl border border-white/10 bg-[#141518] p-6 transition hover:border-emerald-500/30">
  <p className="text-sm font-medium text-gray-400">
    Overall Score
  </p>

  <div className="mt-5 flex items-end gap-2">
    <p className="text-5xl font-bold tracking-tight text-emerald-400">
      {result.overallScore}
    </p>

    <span className="mb-1 text-lg text-gray-500">
      /10
    </span>
  </div>

  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#0b0c0f]">
    <div
      className="h-full rounded-full bg-emerald-500 transition-all duration-700"
      style={{
        width: `${(result.overallScore / 10) * 100}%`,
      }}
    />
  </div>

  <p className="mt-2 text-xs text-gray-500">
    Overall interview performance
  </p>
</div>

        <div className="group rounded-2xl border border-white/10 bg-[#141518] p-6 transition hover:border-white/20">
  <p className="text-sm font-medium text-gray-400">
    Accuracy
  </p>

  <div className="mt-5 flex items-end gap-1">
    <p className="text-5xl font-bold tracking-tight text-white">
      {result.accuracy}
    </p>

    <span className="mb-1 text-lg text-gray-500">
      %
    </span>
  </div>

  <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#0b0c0f]">
    <div
      className="h-full rounded-full bg-white transition-all duration-700"
      style={{
        width: `${Math.min(Math.max(result.accuracy, 0), 100)}%`,
      }}
    />
  </div>

  <p className="mt-2 text-xs text-gray-500">
    Answer accuracy across the interview
  </p>
</div>

        <div className="group rounded-2xl border border-white/10 bg-[#141518] p-6 transition hover:border-emerald-500/30">
  <p className="text-sm font-medium text-gray-400">
    Performance
  </p>

  <div className="mt-5">
    <p className="text-3xl font-bold text-emerald-400">
      {result.overallScore >= 8
        ? "Excellent"
        : result.overallScore >= 6
        ? "Good"
        : "Needs Improvement"}
    </p>

    <p className="mt-2 text-sm text-gray-500">
      Based on your overall interview score
    </p>
  </div>

  <div className="mt-5 flex gap-1">
    {[1, 2, 3, 4, 5].map((level) => (
      <div
        key={level}
        className={`h-2 flex-1 rounded-full ${
          result.overallScore >= level * 2
            ? "bg-emerald-500"
            : "bg-[#0b0c0f]"
        }`}
      />
    ))}
  </div>
</div>

      </div>

      {/* Overall Feedback */}
      <div className="mb-6 rounded-2xl border border-white/10 bg-[#141518] p-6">
        <h2 className="mb-3 text-xl font-semibold">Overall Feedback</h2>
        <p className="leading-7 text-gray-300">
          {result.overallFeedback}
        </p>
      </div>

      {/* Strengths & Weaknesses */}
      <div className="mb-8 grid gap-6 md:grid-cols-2">

        <div className="rounded-2xl border border-white/10 bg-[#141518] p-6">
          <h2 className="mb-4 text-xl font-semibold">Strengths</h2>

          <ul className="space-y-3">
            {result.strengths?.map((strength, index) => (
              <li
                key={index}
                className="rounded-lg border border-emerald-500/10 bg-emerald-500/5 px-4 py-3 text-gray-300"
              >
                <span className="mr-2 text-emerald-400">✓</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-white/10 bg-[#141518] p-6">
          <h2 className="mb-4 text-xl font-semibold">Weaknesses</h2>

          <ul className="space-y-3">
            {result.weaknesses?.map((weakness, index) => (
              <li
                key={index}
                className="rounded-lg border border-red-500/10 bg-red-500/5 px-4 py-3 text-gray-300"
              >
                <span className="mr-2 text-red-400">!</span>
                {weakness}
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* Question Wise Result */}
      <div>
        <h2 className="mb-5 text-2xl font-bold">
          Question-wise Result
        </h2>

        <div className="space-y-5">
          {result.question?.map((question, index) => (
            <div
              key={index}
              className="rounded-2xl border border-white/10 bg-[#141518] p-6"
            >
              <div className="mb-5 flex items-center justify-between">
                <h3 className="text-lg font-semibold">
                  Question {question.order || index + 1}
                </h3>

                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">
                  {question.overallScore}/10
                </span>
              </div>

              <div className="space-y-4">

                <div>
                  <p className="mb-1 text-sm font-medium text-gray-400">
                    Question
                  </p>
                  <p className="leading-6 text-gray-200">
                    {question.question}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-sm font-medium text-gray-400">
                    Expected Answer
                  </p>
                  <p className="leading-6 text-gray-300">
                    {question.expectedAnswer}
                  </p>
                </div>

                <div>
                  <p className="mb-1 text-sm font-medium text-gray-400">
                    Your Answer
                  </p>
                  <p className="leading-6 text-gray-300">
                    {question.userAnswer || "No answer provided"}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">

                  <div className="rounded-xl bg-[#0b0c0f] p-4">
                    <p className="text-xs text-gray-500">Technical</p>
                    <p className="mt-1 font-semibold">
                      {question.technicalScore}/10
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#0b0c0f] p-4">
                    <p className="text-xs text-gray-500">Communication</p>
                    <p className="mt-1 font-semibold">
                      {question.communicationScore}/10
                    </p>
                  </div>

                  <div className="rounded-xl bg-[#0b0c0f] p-4">
                    <p className="text-xs text-gray-500">Confidence</p>
                    <p className="mt-1 font-semibold">
                      {question.confidenceScore}/10
                    </p>
                  </div>

                </div>

                <div>
                  <p className="mb-1 text-sm font-medium text-gray-400">
                    Feedback
                  </p>
                  <p className="leading-6 text-gray-300">
                    {question.feedback}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">

                  <div className="rounded-xl border border-emerald-500/10 bg-emerald-500/5 p-4">
                    <p className="mb-1 text-sm font-medium text-emerald-400">
                      Strength
                    </p>
                    <p className="text-sm leading-6 text-gray-300">
                      {question.strength}
                    </p>
                  </div>

                  <div className="rounded-xl border border-yellow-500/10 bg-yellow-500/5 p-4">
                    <p className="mb-1 text-sm font-medium text-yellow-400">
                      Improvements
                    </p>
                    <p className="text-sm leading-6 text-gray-300">
                      {question.improvements}
                    </p>
                  </div>

                </div>

              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
)
}
}

export default Result;