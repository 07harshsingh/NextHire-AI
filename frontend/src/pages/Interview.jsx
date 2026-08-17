import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/common/Loader";

function Interview(){

    const [question, setQuestion] = useState(null);
    const [totalQuestion, setTotalQuestion] = useState(0);
    const [currentQuestion, setCurrentQuestion] = useState(1);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(true)

    const [interviewFinished, setInterviewFinished] = useState(false);

    const [timeLeft, setTimeLeft] = useState(60);
    

    ////////////Camera stream///////////////
    const [cameraStream , setCameraStream] = useState(null);
    const [cameraError, setCameraError] = useState("");

  useEffect(() => {
    let stream;
    let cancelled;
    const startCamera = async () => {
        try {
            stream = await navigator.mediaDevices.getUserMedia({video: true});
             if (cancelled) {
                stream.getTracks().forEach((track) => track.stop());
                return;
            }
            setCameraStream(stream);
        } catch (err) {
          setCameraError("Camera access is required for the interview.");
        }
    };

    startCamera();

    return () => {
        if (stream) {
            stream.getTracks().forEach((track) => {
                track.stop();
            });
        }
    };
}, []);

 const cameraRef = useRef(null);

useEffect(() => {
    if (cameraStream && cameraRef.current) {
        cameraRef.current.srcObject = cameraStream;

        cameraRef.current.play()
            .then(() => {
                console.log("VIDEO PLAYING");
            })
            .catch((err) => {
                console.log("PLAY ERROR:", err);
            });
    }
}, [cameraStream, loading]);

useEffect(() => {
    if (interviewFinished && cameraStream) {
        cameraStream.getTracks().forEach((track) => {
            track.stop();
        });

        setCameraStream(null);
    }
}, [interviewFinished, cameraStream]);

    const {id} = useParams();

    const navigate = useNavigate()

    const startInterview = async () => {
        try{
            const response = await api.post(`/question/${id}/start`);
            setQuestion(response.data.question);
            setCurrentQuestion(response.data.currentQuestion);
            setTotalQuestion(response.data.totalQuestion);
            setLoading(false);
        }catch(err){
            alert(err.response?.data?.message || "Something went wrong")
        }
    };

    const ref = useRef();

    useEffect(() => {
        if(ref.current) return;
        ref.current = true;
        startInterview();
    },[]);

    ///////Voice Input/////////////
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef(null);

    const startVoiceInput = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if(!SpeechRecognition){
            alert("Your browser doesn't support voice recognition");
            return;
        }
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            setListening(true);
        }
        recognition.onresult = (e) => {
            const transcript = e.results[0][0].transcript;
            setAnswer((prev) => prev? prev+""+transcript:transcript);
        }
        recognition.onerror = (e) => {
            console.log(e.error);
            setListening(false);
        }
        recognition.onend = () => {
            setListening(false);
        }

        recognitionRef.current = recognition;
        recognition.start();
    }

    useEffect(() => {
    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            recognitionRef.current = null;
        }
    };
}, []);

    const isMovingRef = useRef(false);

    const submitAnswer = async () => {
         if (isMovingRef.current) return;
        
          const trimmedAnswer = answer.trim();
          if(!trimmedAnswer){
             alert("Write something before submitting");
             return;
          }

        try{
           const response = await api.post(`/question/${question._id}/answer`, {answer: trimmedAnswer});
           await nextQuestion();
        }catch(err){
           alert(err.response?.data?.message)
        }
    };

    const [submitingInterview, setSubmitingInterview] = useState(false);

    const nextQuestion = async () => {
        if(isMovingRef.current) return;
        isMovingRef.current = true;
        try{
           const response = await api.post(`/question/${id}/next`);
           if(response.data.completed){
               setSubmitingInterview(true);
               await api.post(`/question/${id}/complete`)
               if (recognitionRef.current) {
                   recognitionRef.current.stop();
                   recognitionRef.current = null;
                }
                setSubmitingInterview(false);
               setInterviewFinished(true);
               return;
           }
           setQuestion(response.data.question);
           setTimeLeft(60);
           setTotalQuestion(response.data.totalQuestion);
           setCurrentQuestion(response.data.currentQuestion);
           setAnswer("");
           isMovingRef.current = false;
        }catch(err){
          isMovingRef.current = false;
           alert(err.response?.data?.message)
        }
    };
     //////////Timer/////////////////////
    useEffect(() => {
      if(timeLeft<=0){
         if(answer.trim()){
           submitAnswer()
         }
         else{
           nextQuestion()
         }
         return;
      }
      const timer = setTimeout(() => {
            setTimeLeft((prev) => prev-1)
      },1000)
      
      return () => clearTimeout(timer)

    },[timeLeft])



    if (loading) {
      return <Loader text="Starting your Interview" />;
    }

    if(submitingInterview){
      return <Loader text="Finishing your Interview"/>
    }


    if (interviewFinished) {
  return (
    <div className="min-h-screen bg-[#08090b] px-4 py-10 text-white">
      <div className="mx-auto flex min-h-[80vh] max-w-2xl items-center justify-center">
        <div className="w-full rounded-2xl border border-white/10 bg-[#141518] p-8 text-center">

          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 text-3xl text-emerald-400">
            ✓
          </div>

          <h2 className="text-3xl font-bold">
            Interview Finished
          </h2>

          <p className="mt-3 text-gray-400">
            Your interview has been completed successfully.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Go to Dashboard to see your score.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-8 w-full rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-black hover:bg-emerald-400"
          >
            Dashboard
          </button>

        </div>
      </div>
    </div>
  )
}
    return (
  <div className="min-h-screen bg-[#08090b] px-4 py-8 text-white">
    <div className="mx-auto max-w-4xl">

      <div className="mb-8 relative">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-emerald-400">
              Technical Interview
            </p>

            <h1 className="mt-1 text-3xl font-bold">
              Technical Interview
            </h1>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#141518] px-4 py-2">
            <span className="text-sm text-gray-400">
              Question
            </span>

            <span className="ml-2 font-semibold">
              {currentQuestion}/{totalQuestion}
            </span>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#141518] px-4 py-2">
            <span className="text-sm text-gray-400">
              Time
            </span>

            <span className="ml-2 font-semibold">
              {Math.floor(timeLeft / 60)}:
              {String(timeLeft % 60).padStart(2, "0")}
            </span>
          </div>

        </div>

        {/* Camera Preview */}
        <div className="absolute right-0 top-16 z-10">
        {cameraError && (
          <p className="absolute right-0 top-48 z-10 w-44 rounded-lg bg-red-500/10 p-2 text-xs text-red-400">
          {cameraError}
          </p>
        )}
          <video
             ref={cameraRef}
             autoPlay
             muted
             playsInline
           className="h-28 w-44 rounded-xl border border-white/10 bg-black object-cover"/>
        </div>

        <div className="mt-6 h-2 overflow-hidden rounded-full bg-[#1c1d21]">
          <div
            className="h-full rounded-full bg-emerald-500"
            style={{
              width: `${(currentQuestion / totalQuestion) * 100}%`
            }}
          />
        </div>

      </div>

      <div className="rounded-2xl border border-white/10 bg-[#141518] p-6 sm:p-8">

        <div className="mb-6 flex flex-wrap gap-3">

          <div className="rounded-lg border border-white/10 bg-[#0b0c0f] px-4 py-3">
            <p className="text-xs text-gray-500">
              Difficulty
            </p>

            <p className="mt-1 text-sm font-medium">
              {question.difficulty}
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-[#0b0c0f] px-4 py-3">
            <p className="text-xs text-gray-500">
              Technology
            </p>

            <p className="mt-1 text-sm font-medium">
              {question.technology}
            </p>
          </div>

        </div>

        <div className="mb-8">
          <p className="mb-3 text-sm font-medium text-emerald-400">
            Question {currentQuestion}
          </p>

          <h2 className="text-xl font-semibold leading-8 sm:text-2xl">
            {question.question}
          </h2>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Your Answer
          </label>

          <textarea
            rows="8"
            cols="80"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Write your answer here..."
            className="w-full rounded-xl border border-white/10 bg-[#0b0c0f] px-4 py-4 text-white outline-none placeholder:text-gray-600 focus:border-emerald-500"
          />

        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">

          <button
            type="button"
            onClick={startVoiceInput}
            className={`flex items-center justify-center gap-2 rounded-xl border px-5 py-3 font-medium transition ${
              listening
                ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
                : "border-white/10 bg-[#0b0c0f] text-gray-300 hover:border-emerald-500/40 hover:text-white"
            }`}
          >

            <span
              className={`h-2.5 w-2.5 rounded-full ${
                listening
                  ? "animate-pulse bg-emerald-400"
                  : "bg-gray-500"
              }`}
            />

            {listening ? "Listening..." : "Speak Answer"}

          </button>

          <button
            onClick={submitAnswer}
            className="flex-1 rounded-xl bg-emerald-500 px-5 py-3 font-semibold text-black hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-50">
            Submit
            </button>

        </div>

      </div>

    </div>
  </div>
)
}

export default Interview;