import api from "../api";
import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, ArrowLeft, EyeClosed, Eye, HelpCircle, CheckCircle2, } from "lucide-react";
import logo from "../assets/mef.png";
import { motion, AnimatePresence } from "framer-motion";
import { DarkModeContext } from "./DarkModeContext";

const Modification = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmField, setShowConfirmField] = useState(false);
  const [confirmCancel, setConfirmCancel] = useState(false); // afficher modal confirmation
  const [isSaved, setIsSaved] = useState(false); // nouveau état pour "Sauvegarde..."
  const user = JSON.parse(localStorage.getItem("user"));
  const { darkMode } = useContext(DarkModeContext);

  const navigate = useNavigate();

  const [nom, setNom] = useState(user?.Nom || "");
  const [prenom, setPrenom] = useState(user?.Prenom || "");
  const [email, setEmail] = useState(user?.email || "");
  const [matricule, setMatricule] = useState(user?.Matricule || "");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const handlePasswordChange = (e) => {
    setPassword(e.target.value); // AJOUT
    setShowConfirmField(e.target.value.length > 0);
  };

  const handleSave = async () => {

    if (password && password !== passwordConfirm) {
      alert("Les mots de passe ne correspondent pas !");
      return;
    }

    try {
      const response = await api.put(`/edit/${user.id}`, {
      ...user,
      Nom:nom,
      Prenom:prenom,
      email:email,
      Matricule:matricule,
    });

    localStorage.setItem("user",JSON.stringify(response.data.user));

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      navigate("/profil");
    },2000);
    } catch (error) {
      console.log(error);
      alert("Erreur lors de la modification");
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
            className="relative text-2xl font-semibold tracking-wide top-125 left-180 right-10 text-transparent bg-clip-text"
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
                Modifiez vos informations
              </h2>

              <form className="flex flex-col gap-4">
                <div className="flex flex-col">
                  <label className="mb-1 text-lg font-medium">Nom</label>
                  <input
                    type="text"
                    value={nom}
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
                    type="text"
                    value={prenom}
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
                      type="email"
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
                  <label className="mb-1 text-lg font-medium">Matricule</label>
                  <input
                    type="text"
                    value={matricule}
                    onChange={(e) => setMatricule(e.target.value)}
                    className={`border rounded-xl p-1 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white placeholder-gray-300"
                        : "bg-white border-gray-300 text-gray-900 placeholder-gray-400"
                    }`}
                  />
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

                <button
                  type="button"
                  onClick={() => setConfirmCancel(true)}
                  className="mt-3 bg-green-700 text-white py-3 rounded-xl text-lg hover:bg-green-800 transition-colors font-semibold"
                >
                  Sauvegarder
                </button>
                
                <Link to="/profil"
                  className="mt-3 bg-red-700 text-white py-3 rounded-xl text-lg hover:bg-red-800 transition-colors font-semibold text-center"
                  >
                  <button 
                    type="button"
                  >
                    Annuler
                  </button>
                </Link>
              </form>
            </div>
          </div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
            className="absolute bottom-65 right-58 w-[320px] opacity-100"
          >
            <img src={logo} alt="logo de la Mef" className="w-full" />
          </motion.div>
        </div>
      </div>
          
          {/* MODAL CONFIRMATION */} 
          {confirmCancel && ( 
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-30"> 
              <div className={`p-10 rounded-2xl shadow-xl text-center ${ 
                darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900" }`} >
                  <HelpCircle size={80} className="text-yellow-500 mx-auto mb-4 animate-bounce" /> 
                    <h2 className="text-2xl font-bold mb-2"> Voulez-vous vraiment enregistrer les modifications ? </h2>
                    <div className="flex justify-center gap-4"> 
                      <button onClick={handleSave} 
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition" > 
                        Oui 
                      </button> 
                      <button onClick={() => setConfirmCancel(false)} 
                      className="bg-gray-200 text-black px-6 py-2 rounded-lg hover:bg-gray-300 transition" > 
                        Non 
                      </button> 
                    </div> 
              </div> 
            </div> 
          )}

      {/* MESSAGE "Connexion..." */}
      {isSaved && (
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
            <h2 className="text-2xl font-bold mb-2">Sauvegarde...</h2>
            <p className="text-gray-500 mb-6">
              Vous serez redirigé vers votre profil.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Modification;
