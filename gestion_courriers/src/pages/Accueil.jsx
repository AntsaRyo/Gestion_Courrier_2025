import React, { useContext, useEffect } from "react";
import { DarkModeContext } from "./DarkModeContext";
import {Link, useNavigate} from "react-router-dom";
import {
  Mail,
  Folder,
  BarChart2,
  FolderCog,
  Moon,
  Sun,
  UserCircle,
  ChevronRight,
} from "lucide-react";
import logo from "../assets/mef.png";

const Accueil = () => {
  const role = localStorage.getItem("role");
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();

  // Prevent user from navigating back to login page
  useEffect(() => {
    // Add a dummy entry to browser history when component mounts
    window.history.pushState(null, "", window.location.href);
    
    // Handle back button clicks
    const handlePopState = () => {
      // Redirect back to accueil if user tries to go back
      window.history.pushState(null, "", window.location.href);
      navigate("/accueil");
    };

    window.addEventListener("popstate", handlePopState);

    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [navigate]);

  const cards = [
    {
      title: "Arriver du courrier",
      icon: <Mail size={42} />,
      to: "/information",
      color: "bg-indigo-100 text-indigo-700 hover:bg-indigo-200",
      darkColor: "bg-indigo-800 text-indigo-100 hover:bg-indigo-700",
    },
    {
      title: "Départ du courrier",
      icon: <Mail size={42} />,
      to: "/informationdepart",
      color: "bg-green-100 text-green-700 hover:bg-green-200",
      darkColor: "bg-green-800 text-green-100 hover:bg-green-700",
    },
    {
      title: "Mes dossiers",
      icon: <Folder size={42} />,
      to: "/dossiers-affectes",
      color: "bg-pink-100 text-pink-700 hover:bg-pink-200",
      darkColor: "bg-pink-800 text-pink-100 hover:bg-pink-700",
    },
    ...(role !== "Chef de service" ? [{
      title: "Autres dossiers",
      icon: <Folder size={42} />,
      to: "/dossiers-divisions",
      color: "bg-orange-100 text-orange-700 hover:bg-orange-200",
      darkColor: "bg-orange-800 text-orange-100 hover:bg-orange-700",
    }] : []),
    {
      title: "Tableau de bord",
      icon: <BarChart2 size={42} />,
      to: "/dashboard",
      color: "bg-purple-100 text-purple-700 hover:bg-purple-200",
      darkColor: "bg-purple-800 text-purple-100 hover:bg-purple-700",
    },
    {
      title: "Profil",
      icon: <UserCircle size={42} />,
      to: "/profil",
      color: "bg-blue-100 text-blue-700 hover:bg-blue-200",
      darkColor: "bg-blue-800 text-blue-100 hover:bg-blue-700",
    },
  ];

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-50 text-gray-900"
      }`}
    >
      {/* 🔹 HEADER */}
      <header
        className={`flex items-center justify-between px-6 py-3 ${
          darkMode ? "bg-indigo-950" : "bg-indigo-900"
        } text-white shadow-md`}
      >
        <div className="flex items-center gap-3">
          <img src={logo} alt="logo" className="w-18 h-17 rounded-full" />
          <h1 className="text-4xl font-bold tracking-wide">SIIGC</h1>
        </div>
      </header>

      {/* ACCUEIL */}
      <div className="px-10 py-6">
        <div className="text-align flex">
            <ChevronRight size={22} className="text-indigo-600"/>
        <h2 className="text-3xl font-semibold mb-10"> Accueil</h2>
        </div>

        {/* CARTES AVEC GAPS SYMÉTRIQUES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-10 justify-items-center">
          {cards.map((card, index) => (
            <Link
              key={index}
              to={card.to}
              className={`w-72 h-44 flex flex-col items-center justify-center rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.1)] cursor-pointer transform transition-all duration-300 hover:scale-105 ${
                darkMode ? card.darkColor : card.color
              }`}
            >
              {card.icon}
              <p className="font-semibold text-lg mt-3 text-center">
                {card.title}
              </p>
            </Link>
          ))}
        </div>
      </div>

      {/* BOUTON MODE */}
      <button
        onClick={toggleDarkMode}
        className="fixed bottom-5 right-5 p-3 bg-indigo-600 text-white rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300"
        aria-label="toggle dark mode"
      >
        {darkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>
    </div>
  );
};

export default Accueil;
