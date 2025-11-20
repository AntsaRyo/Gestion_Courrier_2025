import api from "../api";
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, EyeClosed, Eye, CheckCircle2 } from "lucide-react";
import logo from "../assets/mef.png";
import { motion, AnimatePresence } from "framer-motion";
import { DarkModeContext } from "./DarkModeContext";

const InscriptionFormPage = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmField, setShowConfirmField] = useState(false);

  const { darkMode } = useContext(DarkModeContext);

  // Quand on tape un mot de passe, le champ "confirmer" s'affiche
  const handlePasswordChange = (e) => {
    setPassword(e.target.value); // AJOUT
    setShowConfirmField(e.target.value.length > 0);
  };

  const navigate = useNavigate();

  // Champs du formulaire
  const [Nom, setNom] = useState("");
  const [Prenom, setPrenom] = useState("");
  const [email, setEmail] = useState("");
  const [Matricule, setMatricule] = useState("");
  const [role, setRole] = useState("Secretaire");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors , setErrors] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== passwordConfirm) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    const data = {
      Nom,
      Prenom,
      email,
      Matricule,
      role,
      password,
      password_confirmation: passwordConfirm,
    };

    try {
      console.log(data);
      const response = await api.post("/register",data);
      console.log(response);
      setSuccess(true);
      setTimeout(() => {
        navigate("/");
      }, 2500);
    } catch (error) {
      if(error.response.status===422){
          console.log(error);
          setErrors(error.response.data.message);
        } else{
            setErrors('Il y a quelque chose qui cloche');
        }
    }
  };

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
            fill={darkMode ? "#111827" : "#ffffff"}
          />
        </svg>
      </div>

      {/* Contenu principal */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="flex items-center px-8 py-4">
          <motion.h1
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="hidden md:block relative text-2xl font-semibold tracking-wide top-140 left-200 right-10 text-transparent bg-clip-text"
            style={{
              backgroundImage:
                "linear-gradient(90deg, rgb(255, 215, 0), rgb(255, 200, 50), rgb(255, 170, 0))",
            }}
          >
            Système d'Information Integré de Gestion des Courriers
          </motion.h1>
        </div>

        {/* Contenu en 2 colonnes */}
        <div className="flex flex-1 flex-col md:flex-row">
          <div className="relative w-full md:w-2/5 -mt-13 flex items-center justify-center">
            <div
              className={`p-12 pt-5 pb-5 rounded-3xl shadow-2xl w-[500px] h-[100%] transition-colors duration-500 ${
                darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
              }`}
            >
              <h2 className="text-center text-3xl font-semibold mb-3">
                Inscription
              </h2>

              
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="flex flex-col">
                  <label className="mb-1 text-lg font-medium">Nom</label>
                  <input
                    name="Nom"
                    type="text"
                    placeholder="Votre nom"
                    value={Nom}
                    onChange={(e) => setNom(e.target.value)}
                    className={`border rounded-xl p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-300"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    }`}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-lg font-medium">Prénom</label>
                  <input
                    name="Prenom"
                    type="text"
                    placeholder="Votre prénom"
                    value={Prenom}
                    onChange={(e) => setPrenom(e.target.value)}
                    className={`border rounded-xl p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-300"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    }`}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-lg font-medium">Adresse mail</label>
                  <div className="relative">
                    <Mail
                      className={`absolute top-1/2 left-3 -translate-y-1/2 ${
                        darkMode ? "text-gray-400" : "text-gray-400"
                      }`}
                      size={20}
                    />
                    <input
                      name="email"
                      type="email"
                      placeholder="email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={`border rounded-xl p-1 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-300"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      }`}
                    />
                  </div>
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-lg font-medium">IM</label>
                  <input
                    name="Matricule"
                    type="text"
                    placeholder="Votre matricule"
                    value={Matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                    className={`border rounded-xl p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-300"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    }`}
                  />
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-lg font-medium">Fonction</label>
                  <select
                  name="role" value={role} onChange={(e)=>setRole(e.target.value)}
                    className={`border rounded-xl p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-300"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    }`}
                  >
                    <option value="Chef de service">Chef de Service</option>
                    <option value="Secretaire">Secrétaire</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label className="mb-1 text-lg font-medium">Mot de passe</label>
                  <div className="relative">
                    <Lock
                      className={`absolute top-1/2 left-3 -translate-y-1/2 ${
                        darkMode ? "text-gray-400" : "text-gray-400"
                      }`}
                      size={18}
                    />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="********"
                      value={password}
                      onChange={handlePasswordChange}
                      className={`border rounded-xl p-1 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-300"
                          : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
                    </button>
                  </div>
                </div>

                <AnimatePresence>
                  {showConfirmField && (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 15 }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="flex flex-col"
                    >
                      <label className="mb-2 text-lg font-medium">
                        Confirmer le mot de passe
                      </label>
                      <div className="relative">
                        <Lock
                          className={`absolute top-1/2 left-3 -translate-y-1/2 ${
                            darkMode ? "text-gray-400" : "text-gray-400"
                          }`}
                          size={20}
                        />
                        <input
                          type={showConfirm ? "text" : "password"}
                          placeholder="********"
                          value={passwordConfirm}
                          onChange={(e) => setPasswordConfirm(e.target.value)}
                          className={`border rounded-xl p-2 pl-10 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                            darkMode
                              ? "bg-gray-700 border-gray-600 text-white placeholder-gray-300"
                              : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                          {showConfirm ? <Eye size={18} /> : <EyeClosed size={18} />}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {errors &&
                <div className="alert text-red-500">Vérifier remplir tous les champs</div>}

                <button
                  type="submit"
                  className="mt-3 bg-green-700 text-white py-3 rounded-xl text-lg hover:bg-green-800 transition-colors font-semibold"
                >
                  S’inscrire
                </button>
              </form>

              <p className="mt-6 text-center text-base">
                Vous avez déjà un compte ?{" "}
                <Link
                  to="/"
                  className="text-indigo-600 font-medium hover:underline"
                >
                  Se connecter
                </Link>
              </p>
            </div>
          </div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            className="hidden md:block absolute bottom-65 right-100 w-[320px] opacity-100"
          >
            <img src={logo} alt="logo de la Mef" className="w-full" />
          </motion.div>
        </div>
      </div>
          {/* MESSAGE DE SUCCÈS */}
          {success && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-30">
              <div
                className={`p-10 rounded-2xl shadow-xl text-center ${
                  darkMode
                    ? "bg-gray-800 text-gray-100"
                    : "bg-white text-gray-900"
                }`}
              >
                <CheckCircle2
                  size={80}
                  className="text-green-500 mx-auto mb-4 animate-bounce"
                />
                <h2 className="text-2xl font-bold mb-2">
                  Succès !
                </h2>
                <p className="text-gray-500 mb-6">
                  Vous serez redirigé vers la page de connexion.
                </p>
                <Link
                  to="/"
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

export default InscriptionFormPage;
