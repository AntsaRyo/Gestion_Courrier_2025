import api from "../api";
import React, { useState,useContext } from "react";
import { ArrowLeft, Edit, LogOut, UserCircle, CheckCircle2 } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/mef.png";
import { DarkModeContext } from "./DarkModeContext";
import { motion } from "framer-motion";

const ProfilPage = () => {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const navigate = useNavigate();
  const { darkMode } = useContext(DarkModeContext);

  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutSuccess, setLogoutSuccess] = useState(false);

  // Redirect to login if user is not authenticated
  if (!user) {
    navigate("/");
    return null;
  }

  const handleLogout = () => setShowConfirm(true);

  const confirmLogout = async () => {
    try {
      await api.post("/logout");
      localStorage.clear();

      setShowConfirm(false);
      setIsLoggingOut(true);

      setTimeout(() => {  
        setIsLoggingOut(false);  
        setLogoutSuccess(true);  

        setTimeout(() => {  
          navigate("/");  
        }, 1500);  
      }, 1200);  
    } catch (error) {
      console.log(error);
    }
    

  };

return (
<div className={`relative min-h-screen flex flex-col overflow-hidden transition-colors duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
{/* Courbe de fond */} <div className="absolute inset-0"> <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" preserveAspectRatio="none" className="w-full h-full">
<rect width="1440" height="320" fill={darkMode ? "#1f2937" : "#ffffff"} />
<path d="M500,0 Q1000,130 950,420 L1440,320 L1440,0 Z" fill={darkMode ? "#111827" : "#ffffff"} /> </svg> </div>

  <div className="relative z-10 flex flex-col min-h-screen">  
    {/* Header */}
    <div className="flex items-center justify-between px-4 sm:px-8 py-4">
      <div className="w-full sm:w-[90%] md:w-[800px] mx-auto flex items-center">
        {/* Bouton retour */}
        <button
          onClick={() => navigate("/accueil")}
          aria-label="Retour"
          className={`flex items-center justify-center mr-3 p-2 rounded-full transition ${darkMode ? "text-green-400 hover:text-green-200" : "text-green-700 hover:text-green-900"}`}
        >
          <ArrowLeft size={40} className="border rounded-3xl p-1" />
        </button>

        {/* Logo large à côté du titre */}
        <img src={logo} alt="Logo" className="w-16 h-16 sm:w-30 sm:h-25 rounded-full mr-3" />

        {/* Titre (responsive) */}
        <div className="flex flex-col">
          <motion.h1
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-lg sm:text-2xl font-semibold tracking-wide text-transparent bg-clip-text"
            style={{ backgroundImage: "linear-gradient(90deg, rgb(255, 215, 0), rgb(255, 170, 0), #A67C00)" }}
          >
            Système d'Information Intégré de Gestion des Courriers
          </motion.h1>
          <span className="text-xs text-gray-500 hidden sm:block">Service Régional du Budget - Haute Matsiatra</span>
        </div>

        {/* Espace flexible avant le lien profil */}
        <div className="flex-1" />
      </div>
    </div>

    {/* Contenu central */}  
  <div className="flex flex-col items-center flex-grow px-4 sm:px-6 mt-4 sm:mt-0">  
  <div className={`rounded-2xl shadow-2xl w-full sm:w-[90%] md:w-[800px] md:h-[450px] mt-15 p-8 sm:p-8 flex flex-col md:flex-row gap-6 sm:gap-8 transition-colors duration-500 ${darkMode ? "bg-gray-800" : "bg-gray-100"} mx-auto`}> 

        {/* Colonne gauche */}  
        <div className={`flex flex-col items-center md:w-1/3 border-b md:border-b-0 md:border-r pr-0 md:pr-6 pb-6 md:pb-0 ${darkMode ? "border-green-700" : "border-indigo-400"}`}>  
          <div className={`rounded-full p-4 mb-3 ${darkMode ? "bg-green-600" : "bg-green-700"}`}>  
            <UserCircle size={70} className="text-white" />  
          </div>  
          <h2 className="text-lg font-semibold text-center md:text-left">{user.Nom}</h2>  
          <h4 className="text-lg font-semibold text-center md:text-left">{user.Prenom}</h4>  

          <div className="flex flex-col gap-4 sm:gap-7 mt-4 sm:mt-6 w-full">  
            <Link to="/modification-form" className={`flex items-center justify-center gap-2 font-medium py-2 rounded-lg transition ${darkMode ? "bg-green-700 text-green-200 hover:bg-green-800" : "bg-green-100 text-green-700 hover:bg-green-800"}`}>  
              <Edit size={18} />  
              Éditer  
            </Link>  

            {!showConfirm && !isLoggingOut && !logoutSuccess && (  
              <button onClick={handleLogout} className={`flex items-center justify-center gap-2 font-medium py-2 rounded-lg transition ${darkMode ? "bg-red-700 text-white hover:bg-red-800" : "bg-red-700 text-white hover:bg-red-800"}`}>  
                <LogOut size={18} />  
                Déconnexion  
              </button>  
            )}  
          </div>  
        </div>  

        {/* Colonne droite */}  
        <div className="flex-1 text-sm sm:text-base space-y-6 mt-5">  
          <div>  
            <h3 className={`font-semibold text-2xl border-b pb-1 mb-3 ${darkMode ? "text-green-400 border-green-700" : "text-green-700 border-indigo-400"}`}>Infos</h3>  
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">  
              <p><span className="font-semibold text-lg">Matricule :</span><br /><span className={`italic text-xl pb-1 mb-3 ${darkMode ? "text-gray-400 border-gray-700" : "text-gray-700 border-indigo-400"}`}>{user.Matricule}</span></p>
            </div>  
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
              <p><span className="font-semibold text-lg">Email :</span><br /><span className={`italic text-xl pb-1 mb-3 ${darkMode ? "text-gray-400 border-gray-700" : "text-gray-700 border-indigo-400"}`}>{user.email}</span></p>  
            </div>  
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">  
              <p><span className="font-semibold text-lg">Fonction :</span><br /><span className={`italic text-xl pb-1 mb-3 ${darkMode ? "text-gray-400 border-gray-700" : "text-gray-700 border-indigo-400"}`}>{user.role}</span></p>
            </div>  
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
              <p><span className="font-semibold text-lg">Département :</span><br /><span className={`italic text-xl pb-1 mb-3 ${darkMode ? "text-gray-400 border-gray-700" : "text-gray-700 border-indigo-400"}`}>Service Régional du Budget Haute Matsiatra</span></p>
            </div>  
          </div>  
        </div>  
      </div>  
    </div>  

    {/* MESSAGE BOX */}  
    {(showConfirm || isLoggingOut || logoutSuccess) && (  
      <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-30">  
        <div className={`p-8 sm:p-10 rounded-2xl shadow-xl text-center ${darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"}`}>  
          <CheckCircle2 size={80} className={`text-green-500 mx-auto mb-4 ${isLoggingOut || logoutSuccess ? "animate-bounce" : ""}`} />  

          {showConfirm && !isLoggingOut && !logoutSuccess && (  
            <>  
              <p className="font-semibold text-center mb-4">Voulez-vous vraiment vous déconnecter ?</p>  
              <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-4">  
                <button onClick={confirmLogout} className={`px-4 py-1 rounded-lg font-medium ${darkMode ? "bg-green-600 hover:bg-green-700 text-white" : "bg-green-700 hover:bg-green-800 text-white"}`}>Oui</button>  
                <button onClick={() => setShowConfirm(false)} className={`px-4 py-1 rounded-lg font-medium ${darkMode ? "bg-gray-500 hover:bg-gray-600 text-white" : "bg-gray-400 hover:bg-gray-500 text-white"}`}>Non</button>  
              </div>  
            </>  
          )}  

          {isLoggingOut && !logoutSuccess && (  
            <>  
              <h2 className="text-2xl font-bold mb-2">Déconnexion...</h2>  
              <p className="text-gray-500 mb-6">Vous serez redirigé vers la page de connexion.</p>  
            </>  
          )}  

          {logoutSuccess && (  
            <>  
              <h2 className="text-2xl font-bold mb-2">Déconnexion réussie !</h2>  
              <p className="text-gray-500 mb-6">Vous allez être redirigé vers la page de connexion.</p>  
            </>  
          )}  
        </div>  
      </div>  
    )}  
  </div>  
</div>  

);
};

export default ProfilPage;
