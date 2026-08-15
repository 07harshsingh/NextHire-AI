import { useEffect } from "react";

function Toast({message, type, onClose}){

    useEffect(() => {
        console.log("Toast timer started");
        const timer = setTimeout(() => {
            console.log("Toast closing");
             onClose()
        },3000)
        console.log("Toast timer cleared");
        return () => clearTimeout(timer)
    },[message])

     return(
        <div
        className={`fixed right-5 top-5 z-50 rounded-xl border px-5 py-4 shadow-2xl ${
        type === "success"
            ? "border-emerald-500/20 bg-[#141518] text-emerald-400"
            : "border-red-500/20 bg-[#141518] text-red-400"
        }`}
        >
        <div className="flex items-center gap-3">
        <span className="text-lg">
            {type === "success" ? "✓" : "!"}
        </span>

        <p className="text-sm font-medium text-gray-200">
            {message}
            </p>
         </div>
       </div>
        
     )

}

export default Toast;