import { Link, useLocation, useNavigate } from "react-router-dom";

function Navbar() {

  const navigate = useNavigate();

  const location = useLocation();

  const handleLogout = () => {
    const isLogout = window.confirm("Are you sure want to logout?")
    if(!isLogout) return;
    localStorage.removeItem("token");
    navigate("/login")
  }

   return (
  <nav className="mx-auto mt-4 w-[calc(100%-1rem)] max-w-7xl rounded-2xl border border-white/10 bg-[#111214]/90 shadow-lg backdrop-blur-xl">
    <div className="flex h-16 items-center justify-between px-4 sm:px-7">

      {/* Logo */}
      <Link
        to="/dashboard"
        className="shrink-0 text-xl font-bold tracking-tight text-white transition hover:text-emerald-400"
      >
        Next<span className="text-emerald-400">Hire</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden items-center gap-2 md:flex">

        <Link
           to="/dashboard"
           className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
           location.pathname === "/dashboard"
           ? "bg-emerald-500/10 text-emerald-400" : "text-gray-400 hover:bg-white/5 hover:text-white"
        }`}
         >Dashboard</Link>

        <Link
           to="/myprofile"
           className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
           location.pathname === "/myprofile"
           ? "bg-emerald-500/10 text-emerald-400": "text-gray-400 hover:bg-white/5 hover:text-white"
          }`}
          >Profile</Link>

      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="shrink-0 rounded-lg border border-white/10 bg-[#181a1e] px-3 py-2 text-xs font-medium text-gray-300 transition hover:border-red-500/30 hover:bg-red-500/10 hover:text-red-400 sm:px-4 sm:text-sm"
      >
        Logout
      </button>

    </div>
  </nav>
)
}

export default Navbar;