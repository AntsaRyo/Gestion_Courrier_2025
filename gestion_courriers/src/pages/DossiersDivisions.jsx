import React, { useContext } from "react";
import { DarkModeContext } from "./DarkModeContext";
import { SidebarContext } from "./SideBarContext";
import { Link , useNavigate } from "react-router-dom";
import {
  Menu,
  Mail,
  Folder,
  Sun,
  Moon,
  UserCircle,
  Grid,
  FileText,
  Home
} from "lucide-react";
import logo from "../assets/mef.png";

const DossiersDivisions = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
    const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext);
  const currentPage = "Dossiers des divisions";
  const navigate = useNavigate();

  const divisions = [
    { name: "BAAF"},
    { name: "Bureau MTA"},
    { name: "Bureau LBA"},
    { name: "Bureau EPN"},
    { name: "Bureau F & A"},
    { name: "Bureau RFM"},
    { name: "Bureau Ex° Budgétaire"},
    { name: "Bureau Maintenance"},
    { name: "Bureau Finance Locale"},
    { name: "Cellule PERS"},
    { name: "Cellule d'App et Coord"},
    { name: "Chef SRB"},
    { name: "CIR"},
    { name: "Compta et Logistique"},
    { name: "Div Ex° Budgétaire et RFM"},
    { name: "Div Finance Locale et EPN"},
    { name: "Div Patrimoine de l' Etat"},
    { name: "Garage Administratif"},
    { name: "MEDECIN"},
    { name: "PRMP"},
    { name: "Secretaire Porte 11"},
  ];

  const handleDivisionClick = (nomDivision) => {
    navigate(`/dossiers-suivis/${encodeURIComponent(nomDivision)}`);
  }

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* HEADER */}
      <header
        className={`fixed w-full z-40 flex items-center justify-between px-6 py-4 transition-colors duration-300 ${
          darkMode ? "bg-gray-800 text-gray-100" : "bg-indigo-900 text-white"
        }`}
      >
        <div className="flex items-center gap-3">
          <img src={logo} alt="Logo" className="w-18 h-17 rounded-full" />
          <h1 className="text-4xl font-bold">SIIGC</h1>
        </div>

        <Link to="/profil" className="flex items-center gap-3">
          <span className="hidden sm:block font-medium hover:underline">
            {user.Prenom}
          </span>
          <UserCircle
            size={40}
            className={`${darkMode ? "text-gray-100" : "text-white"}`}
          />
        </Link>
      </header>

      {/* LAYOUT: SIDEBAR + MAIN */}
      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-24"
          } fixed h-full flex flex-col transition-all duration-300 pt-30 border-r ${
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
            {sidebarOpen && <h2 className="font-semibold text-lg">Menu</h2>}
            <button
              onClick={() => setSidebarOpen(prev => !prev)}
              className={`${
                darkMode
                  ? "text-indigo-300 hover:text-indigo-400"
                  : "text-indigo-700 hover:text-indigo-900"
              }`}
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
                        ? "hover:bg-gray-700 text-gray-100"
                        : "hover:bg-indigo-50 text-indigo-800"
                    }`}
                  >
                    <Home size={18} />{" "}
                    {sidebarOpen && "Accueil"}
                  </li>
                </Link>
                <Link to="/information">
                  <li
                    className={`p-2 rounded-md cursor-pointer flex items-center gap-3 font-medium ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-100"
                        : "hover:bg-indigo-50 text-indigo-800"
                    }`}
                  >
                    <Mail size={18} /> {sidebarOpen && "Arriver du courrier"}
                  </li>
                </Link>
                <Link to="/informationdepart">
                  <li
                    className={`p-2 rounded-md cursor-pointer flex items-center gap-3 font-medium ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-100"
                        : "hover:bg-indigo-50 text-indigo-800"
                    }`}
                  >
                    <Mail size={18} /> {sidebarOpen && "Départ du courrier"}
                  </li>
                </Link>
                <Link to="/dashboard">
                  <li
                    className={`p-2 rounded-md cursor-pointer flex items-center gap-3 font-medium ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-100"
                        : "hover:bg-indigo-50 text-indigo-800"
                    }`}
                  >
                    <Grid size={18} /> {sidebarOpen && "Tableau de bord"}
                  </li>
                </Link>
              </ul>
            </div>

            { role === "Chef de service" && (
              <div>
                <p
                  className={`font-semibold mt-3 ${
                    darkMode ? "text-indigo-300" : "text-indigo-800"
                  }`}
                >
                  Mes dossiers
                </p>
                <ul className="space-y-2 mt-1">
                  <Link to="/dossiers-affectes">
                    <li
                      className={`p-2 rounded-md cursor-pointer flex items-center gap-2 ${
                        darkMode
                          ? "hover:bg-gray-700 text-gray-100"
                          : "hover:bg-indigo-50"
                      }`}
                    >
                      <Folder size={18} /> {sidebarOpen && "Dossiers à affectés"}
                    </li>
                  </Link>
                  <Link to="/dossiers-valider">
                    <li
                      className={`p-2 rounded-md cursor-pointer flex items-center gap-2 ${
                        darkMode
                          ? "hover:bg-gray-700 text-gray-100"
                          : "hover:bg-indigo-50"
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

            <div>
              <p
                className={`font-semibold mt-3 ${
                  darkMode ? "text-indigo-300" : "text-indigo-800"
                }`}
              >
                Autres
              </p>
              <ul className="space-y-2 mt-1">
                <Link to="/dossiers-divisions">
                  <li
                    className={`p-2 rounded-md cursor-pointer flex items-center gap-2 ${
                      currentPage === "Dossiers des divisions"
                        ? darkMode
                        ? "bg-indigo-900 text-indigo-200"
                        : "bg-indigo-100 text-indigo-800"
                        : darkMode
                        ? "hover:bg-gray-700 text-gray-100"
                      : "hover:bg-indigo-50 text-indigo-800"
                    }`}
                  >
                    <Folder size={18} />{" "}
                    {sidebarOpen && "Dossiers des divisions"}
                  </li>
                </Link>
                <Link to="/archives-arrive">
                  <li
                    className={`p-2 rounded-md cursor-pointer flex items-center gap-2 ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-100"
                        : "hover:bg-indigo-50"
                    }`}
                  >
                    <Folder size={18} />{" "}
                    {sidebarOpen && "Archives des courriers arrivés"}
                  </li>
                </Link>
                <Link to="/archives-depart">
                  <li
                    className={`p-2 rounded-md cursor-pointer flex items-center gap-2 ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-100"
                        : "hover:bg-indigo-50"
                    }`}
                  >
                    <Folder size={18} />{" "}
                    {sidebarOpen && "Archives des courriers envoyés"}
                  </li>
                </Link>
              </ul>
            </div>
          </nav>
        </aside>

        {/* MAIN */}
        <main className={`flex-1 p-6 overflow-auto transition-all duration-300 pt-30 relative ${
          sidebarOpen ? "ml-64" : "ml-24"
        }`}>
          <h2 className="text-3xl font-semibold mb-6 text-indigo-700">
            Les divisions
          </h2>


          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
            {divisions.map((division, index) => (
              <div
                key={index}
                onClick={() => handleDivisionClick(division.name)}
                className={`p-5 rounded-2xl shadow-md flex items-center justify-between transition transform hover:scale-105 ${
                  darkMode
                    ? "bg-gray-800 text-gray-100 hover:bg-gray-700"
                    : "bg-white text-gray-900 hover:bg-indigo-50"
                }`}
              >
                <div>
                  <h3 className="font-semibold text-lg">{division.name}</h3>
                </div>
                <FileText
                  size={34}
                  className={`${
                    darkMode ? "text-indigo-400" : "text-indigo-600"
                  }`}
                />
              </div>
            ))}
          </div>

          <div className="fixed bottom-4 right-4 ">
            <button
              onClick={toggleDarkMode}
              className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition"
              aria-label="toggle dark mode"
            >
              {darkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DossiersDivisions;
