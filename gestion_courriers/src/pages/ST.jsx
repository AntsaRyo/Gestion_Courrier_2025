import React, { useState, useRef, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, Mail, Grid, Folder, Home, UserCircle, Moon, Sun, HelpCircle } from "lucide-react";
import { generateStPdf } from "./StGenerator";
import logo from "../assets/mef.png"; 

import { DarkModeContext } from "./DarkModeContext";
import { SidebarContext } from "./SideBarContext";

const SoitTransmis = () => {
  const role = localStorage.getItem("role");
  const location = useLocation();
  const selectedData = location.state?.courrier;

  // États
  const [currentPage] = useState("Départ du courrier");
  const [ObjetDepart, setObjetDepart] = useState("");
  const [numero_correspondance_depart, setNumero_correspondance_depart] = useState("");
  const [DestinataireDepart, setDestinataireDepart] = useState("");
  const [ObservationsDepart, setObservationDepart] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const formRef = useRef();
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext);

  // remplissage automatique des champs selon les données reçues lors du chargement
    useEffect(() => {
    if (selectedData) {
      setObjetDepart(selectedData.ObjetDepart || "");
      setNumero_correspondance_depart(selectedData.numero_correspondance_depart || "");
      setDestinataireDepart(selectedData.DestinataireDepart || "");
      setObservationDepart(selectedData.ObservationsDepart || "");
    }
    }, [selectedData]);

  // generate PDF
  const handleGeneratePdf = async () => {
    setIsGenerating(true);
    try {
      await generateStPdf({
        ObjetDepart,
        numero_correspondance_depart,
        DestinataireDepart,
        ObservationsDepart
      });
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la génération du PDF.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-indigo-50">
      {/* HEADER */}
      <header
        className={`flex items-center justify-between px-6 py-4 transition-colors duration-300 ${
          darkMode ? "bg-gray-800 text-gray-100 border-b border-gray-700" : "bg-indigo-900 text-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-18 h-17 rounded-full" />
          <h1 className="text-4xl font-bold">SIIGC</h1>
        </div>

        <Link to="/profil" className="flex items-center gap-3">
          <span className="hidden sm:block font-medium hover:underline">
            HARINANTOANDRO Fandresena
          </span>
          <UserCircle size={40} className={`${darkMode ? "text-gray-100" : "text-white"}`} />
        </Link>
      </header>

      {/* LAYOUT */}
      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-24"
          } transition-all duration-300 flex flex-col border-r ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-gray-100"
              : "bg-white border-gray-200 text-gray-800"
          }`}
        >
          <div
            className={`flex items-center justify-between px-4 py-3 border-b ${
              darkMode ? "border-gray-700" : "border-gray-200"
            }`}
          >
            {sidebarOpen && (
              <h2 className="font-semibold text-lg">
                {darkMode ? "Menu" : "Menu"}
              </h2>
            )}
            <button
              onClick={() => setSidebarOpen(prev => !prev)}
              className={`${
                darkMode
                  ? "text-indigo-300 hover:text-indigo-400"
                  : "text-indigo-700 hover:text-indigo-900"
              }`}
              aria-label="toggle sidebar"
            >
              <Menu size={22} />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 text-sm space-y-4 overflow-y-auto">
            <div>
              <ul className="space-y-2">
                <Link to="/accueil">
                  <li
                    className={`p-2 rounded-md cursor-pointer flex items-center gap-3 font-medium ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-200"
                        : "hover:bg-indigo-50 text-indigo-800"
                    }`}
                  >
                    <Home size={18} /> {sidebarOpen && "Accueil"}
                  </li>
                </Link>
                <Link to="/information">
                <li
                  className={`p-2 rounded-md cursor-pointer flex items-center gap-3 font-medium ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-200"
                        : "hover:bg-indigo-50 text-indigo-800"
                    }`}
                >
                  <Mail size={18} /> {sidebarOpen && "Arrivée du courrier"}
                </li>
                </Link>

                <li
                  className={`p-2 rounded-md cursor-pointer flex items-center gap-3 font-medium ${
                    currentPage === "Départ du courrier"
                      ? darkMode
                        ? "bg-indigo-900 text-indigo-200"
                        : "bg-indigo-100 text-indigo-800"
                      : darkMode
                      ? "hover:bg-gray-700 text-gray-100"
                      : "hover:bg-indigo-50 text-indigo-800"
                  }`}
                >
                  <Mail size={18} /> {sidebarOpen && "Départ du courrier"}
                </li>

                <Link to="/dashboard">
                  <li
                    className={`p-2 rounded-md cursor-pointer flex items-center gap-3 font-medium ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-200"
                        : "hover:bg-indigo-50 text-indigo-800"
                    }`}
                  >
                    <Grid size={18} /> {sidebarOpen && "Dashboard"}
                  </li>
                </Link>
              </ul>
            </div>

            { role === "Chef de service" && (
              <div>
                <p className="font-semibold mt-3 text-indigo-500">Mes dossiers</p>
                <ul className="space-y-2 mt-1">
                  <li
                    className={`p-2 rounded-md cursor-pointer flex items-center gap-2 font-medium transition ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-200"
                        : "hover:bg-indigo-50 text-gray-800"
                    }`}
                  >
                    <Link
                      to="/dossiers-affectes"
                      className="flex items-center gap-2 w-full"
                    >
                      <Folder size={18} /> {sidebarOpen && "Dossiers à affecter"}
                    </Link>
                  </li>

                  <Link to="/dossiers-valider">
                    <li
                      className={`p-2 rounded-md cursor-pointer flex items-center gap-2 font-medium transition ${
                        darkMode
                          ? "hover:bg-gray-700 text-gray-200"
                          : "hover:bg-indigo-50 text-gray-800"
                      }`}
                      >
                        <Folder size={18} /> {sidebarOpen && "Dossiers à valider"}
                    </li>
                  </Link>
                </ul>
              </div>
            )}

            { role === "Secretaire" && (
              <div>
                <p
                  className={`font-semibold mt-3 ${
                    darkMode ? "text-indigo-300" : "text-indigo-800"
                  }`}
                >
                  Mes dossiers
                </p>
                <ul className="space-y-2 mt-1">
                  <Link to="/dossiers-traites">
                    <li
                      className={`p-2 rounded-md cursor-pointer flex items-center gap-2 font-medium transition ${
                        darkMode
                          ? "hover:bg-gray-700 text-gray-200"
                          : "hover:bg-indigo-50 text-gray-800"
                      }`}
                    >
                      <Folder size={18} /> {sidebarOpen && "Courriers traités"}
                    </li>
                  </Link>
                  <Link to="/dossiers-valides">
                    <li
                      className={`p-2 rounded-md cursor-pointer flex items-center gap-2 font-medium transition ${
                        darkMode
                          ? "hover:bg-gray-700 text-gray-200"
                          : "hover:bg-indigo-50 text-gray-800"
                      }`}
                    >
                      <Folder size={18} /> {sidebarOpen && "Courriers validés"}
                    </li>
                  </Link>

                  <li
                                    className={`p-2 rounded-md cursor-pointer flex items-center gap-2 font-medium transition ${
                                      darkMode
                                        ? "hover:bg-gray-700 text-gray-200"
                                        : "hover:bg-indigo-50 text-gray-800"
                                    }`}
                                  >
                                    <Link
                                      to="/dossiers-assignes"
                                      className="flex items-center gap-2 w-full"
                                    >
                                      <Folder size={18} /> {sidebarOpen && "Courriers à dispatchés"}
                                    </Link>
                                  </li>
                </ul>
              </div>
            )}

            {/* DOSSIERS DES DIVISIONS */}
            {role === "Secretaire" && (
              <div>
                <p className="font-semibold mt-3 text-indigo-500">
                  Autres
                </p>
                <ul className="space-y-2 mt-1">
                  <li
                    className={`p-2 rounded-md cursor-pointer flex items-center gap-2 font-medium transition ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-200"
                        : "hover:bg-indigo-50 text-gray-800"
                    }`}
                  >
                    <Link
                      to="/dossiers-divisions"
                      className="flex items-center gap-2 w-full"
                    >
                      <Folder size={18} />{" "}
                      {sidebarOpen && "Dossiers des divisions"}
                    </Link>
                  </li>

                  <li
                    className={`p-2 rounded-md cursor-pointer flex items-center gap-2 font-medium transition ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-200"
                        : "hover:bg-indigo-50 text-gray-800"
                    }`}
                  >
                    <Link
                      to="/archives-arrive"
                      className="flex items-center gap-2 w-full"
                    >
                      <Folder size={18} />{" "}
                      {sidebarOpen && "Archives des courriers arrivés"}
                    </Link>
                  </li>

                  <li
                    className={`p-2 rounded-md cursor-pointer flex items-center gap-2 font-medium transition ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-200"
                        : "hover:bg-indigo-50 text-gray-800"
                    }`}
                  >
                    <Link
                      to="/archives-depart"
                      className="flex items-center gap-2 w-full"
                    >
                      <Folder size={18} />{" "}
                      {sidebarOpen && "Archives des courriers envoyés"}
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </nav>
        </aside>

        {/* MAIN */}
        <main className={`flex-1 p-8 overflow-auto transition-all duration-300 pt-17 relative ${
            sidebarOpen ? "ml-0" : "ml-24"
          } ${
            darkMode ? "bg-gray-900 text-gray-100" : "bg-indigo-50 text-gray-900"
          }`} ref={formRef}>
          {/* BOUTON DARK MODE */}
          <div className="absolute bottom-4 right-4 z-20">
            <button
              onClick={toggleDarkMode}
              className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition"
              aria-label="toggle dark mode"
            >
              {darkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
          </div>

          {/* CONTENU PRINCIPAL */}
          <div className={`max-w-5xl mx-auto rounded-xl p-8 shadow-sm transition-colors duration-300 ${
              darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
          }`}>
            <h2 className={`text-3xl m-10 font-semibold text-center ${
                  darkMode ? "text-white" : "text-indigo-800"
                }`}>
                  INFORMATIONS SUR LE SOIT TRANSMIS
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block text-2lg font-bold text-indigo-700 ${
                  darkMode ? "text-white" : "text-indigo-700"
                }`}>Numéro de la correspondace</label>
                <input 
                  value={numero_correspondance_depart}
                  readOnly
                  type="text"
                  className={`mt-2 w-full px-3 py-2 border rounded-md text-sm ${
                    darkMode
                      ? "border-gray-600 bg-gray-700 text-gray-300"
                      : "border-gray-300 text-gray-500"
                  }`}
                  placeholder="Numéro de la correspondance..." 
                />
              </div>

              <div>
                <label className={`block text-2lg font-bold text-indigo-700 ${
                  darkMode ? "text-white" : "text-indigo-700"
                }`}>Destinataire</label>
                <input 
                  value={DestinataireDepart}
                  readOnly
                  className={`mt-2 w-full px-3 py-2 border rounded-md text-sm ${
                    darkMode
                      ? "border-gray-600 bg-gray-700 text-gray-300"
                      : "border-gray-300 text-gray-500"
                  }`}
                  placeholder="Destinataire..." 
                />
              </div>

              <div>
                <label className={`block text-2lg font-bold text-indigo-700 ${
                  darkMode ? "text-white" : "text-indigo-700"
                }`}>Objet</label>
                <input 
                  type="text"
                  value={ObjetDepart}
                  readOnly
                  className={`mt-2 w-full px-3 py-2 border rounded-md text-sm ${
                    darkMode
                      ? "border-gray-600 bg-gray-700 text-gray-300"
                      : "border-gray-300 text-gray-500"
                  }`}
                  placeholder="texte" 
                />
              </div>

              <div>
                <label className={`block text-2lg font-bold text-indigo-700 ${
                  darkMode ? "text-white" : "text-indigo-700"
                }`}>Observation</label>
                <input 
                  value={ObservationsDepart}
                  readOnly
                  className={`mt-2 w-full px-3 py-2 border rounded-md text-sm ${
                    darkMode
                      ? "border-gray-600 bg-gray-700 text-gray-300"
                      : "border-gray-300 text-gray-500"
                  }`}
                  placeholder="Observation..." 
                />
              </div>

            </div>

            {/* actions */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <button
                onClick={handleGeneratePdf}
                className="w-64 py-2 rounded-full bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
                
              >
                {isGenerating ? "Génération du PDF..." : "Générer le PDF"}
              </button>

              <Link
                to="/informationdepart"
                className="w-64 py-2 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition text-center"
              >
                Annuler
              </Link>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SoitTransmis;
