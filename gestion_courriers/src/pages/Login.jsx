import api from "../api";
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, EyeClosed, Eye, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import logo from "../assets/mef.png";
import { DarkModeContext } from "./DarkModeContext";

const Connexion = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);
  const { darkMode } = useContext(DarkModeContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/login", {
        email,
        password
      });

      const data = response.data;

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);

      setSuccess(true);
      setTimeout(() => {
        window.history.pushState(null, "", window.location.href);
        window.onpopstate = () => {
          navigate("/accueil");
        };
        navigate("/accueil");
      }, 2500);

    } catch (error) {
      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        alert("Erreur de connexion au serveur");
      }
    }

    
  }

  return (
    <div
      className={`relative min-h-screen flex flex-col overflow-hidden transition-colors duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"
      }`}
    >
      {/* Courbe de fond */}
      <div className="absolute inset-0">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          <rect
            width="1440"
            height="320"
            fill={darkMode ? "#1f2937" : "#ffffffff"}
          />
          <path
            d="M500,0 Q1000,130 950,420 L1440,320 L1440,0 Z"
            fill={darkMode ? "#111827" : "#ffffffff"}
          />
        </svg>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-4">
          <button
            className={`flex items-center transition ${
              darkMode ? "hover:text-indigo-300" : "hover:text-indigo-200"
            }`}
          >
            <ArrowLeft size={1} />
          </button>

          <motion.h1
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="hidden md:block relative text-2xl font-semibold tracking-wide top-140 right-50 text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgb(255, 215, 0), rgb(255, 200, 50), rgb(255, 170, 0))",
            }}
          >
            Système d'Information Integré de Gestion des Courriers
          </motion.h1>
        </div>

        {/* Left: Form */}
        <div className="relative w-full md:w-1/2 flex flex-col items-center justify-center top-50">
          <div
            className={`p-8 rounded-2xl shadow-2xl w-[360px] transition-colors duration-500 ${
              darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
            }`}
          >
            <h2 className="text-center text-xl font-semibold mb-8">
              Se connecter
            </h2>

            
            <form className="flex flex-col gap-4" onSubmit={handleLogin}>
              <div className="flex flex-col">
                <label className="mb-1">Adresse email</label>
                <div className="relative">
                  <Mail
                    className={`absolute top-1/2 left-2 -translate-y-1/2 ${
                      darkMode ? "text-gray-400" : "text-gray-400"
                    }`}
                    size={18}
                  />
                  <input
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`border rounded-xl p-2 pl-8 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-300"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    }`}
                  />
                </div>
              </div>

              <div className="flex flex-col">
                <label className="mb-1">Mot de passe</label>
                <div className="relative">
                  <Lock
                    className={`absolute top-1/2 left-2 -translate-y-1/2 ${
                      darkMode ? "text-gray-400" : "text-gray-400"
                    }`}
                    size={18}
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="********"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border border-gray-300 rounded-xl p-2 pl-8 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute top-1/2 right-3 -translate-y-1/2 hover:text-gray-600 text-gray-400"
                  >
                    {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
                  </button>
                </div>
                {error &&
                <div className="text-red-500">Vérifier tous les champs</div>}

                <button type="submit" className="bg-green-700 text-white py-2 rounded-xl hover:bg-green-800 transition-colors mt-2">
                Se connecter
                </button>
              </div>
            </form>

            <p className="text-sm mt-4 text-center">
              Vous n'avez pas de compte?{" "}
              <Link
                to="/inscription-form"
                className="text-indigo-600 hover:underline"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
          {/* Titre principal sous le formulaire sur mobile/tablette */}
          <motion.h1
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="mt-45 text-center text-xl font-semibold tracking-wide text-transparent bg-clip-text md:hidden"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgb(255, 215, 0), rgb(255, 200, 50), rgb(255, 170, 0))",
            }}
          >
            Système d'Information Integré de Gestion des Courriers
          </motion.h1>

        {/* Illustration logo */}
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
          className="hidden md:block absolute bottom-65 right-100 w-[320px] opacity-100 md"
        >
          <img src={logo} alt="logo de la Mef" className="w-full" />
        </motion.div>
      </div>

      {/* MESSAGE DE SUCCÈS */}
      {success && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-30">
          <div
            className={`p-10 rounded-2xl shadow-xl text-center ${
              darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
            }`}
          >
            <CheckCircle2
              size={80}
              className="text-green-500 mx-auto mb-4 animate-bounce"
            />
            <h2 className="text-2xl font-bold mb-2">Bienvenue !</h2>
            <Link
              to="/accueil"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Aller directement...
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Connexion;
