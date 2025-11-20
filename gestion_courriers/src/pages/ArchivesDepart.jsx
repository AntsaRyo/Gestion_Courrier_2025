import api from "../api";
import React, { useEffect, useState, useContext } from "react";
import { DarkModeContext } from "./DarkModeContext";
import { SidebarContext } from "./SideBarContext";
import { Link } from "react-router-dom";
import {
  Menu,
  Mail,
  Folder,
  Sun,
  Moon,
  UserCircle,
  Info,
  Grid,
  Home,
} from "lucide-react";
import logo from "../assets/mef.png";

const ArchivesDepart = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const { sidebarOpen, setSidebarOpen } = useContext(SidebarContext);
  const [courriers, setCourriers] = useState([]);

  const currentPage = "Archives des courriers envoyés";

  // États pour les filtres
  const [filterDestinataireDepart, setFilterDestinataireDepart] = useState("");
  const [filterDateDepart, setFilterDateDepart] = useState("");
  const [filterNumero_Correspondance_Depart, setFilterNumero_Correspondance_depart] = useState("");
  const [filterObjetDepart, setFilterObjetDepart] = useState("");
  const [filterDateCorrespondanceDepart, setFilterDateCorrespondanceDepart] = useState("");

  const reset = () => {
    setFilterDestinataireDepart("");
    setFilterDateDepart("");
    setFilterNumero_Correspondance_depart("");
    setFilterObjetDepart("");
    setFilterDateCorrespondanceDepart("");
  };

  // Helper to format various date representations into YYYY-MM-DD for display
  const formatDate = (v) => {
    if (v === null || v === undefined || v === "") return "";
    // If already YYYY-MM-DD
    if (typeof v === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(v)) return v;
    // ISO-like string (with time): extract date portion before 'T'
    if (typeof v === 'string') {
      const m = v.match(/^(\d{4}-\d{2}-\d{2})T/);
      if (m) return m[1];
      // Fallback: try to parse
      const d = new Date(v);
      if (!isNaN(d)) return d.toISOString().slice(0, 10);
      return v;
    }
    if (v instanceof Date) {
      if (!isNaN(v)) return v.toISOString().slice(0, 10);
      return "";
    }
    // Last resort: coerce to Date
    try {
      const d = new Date(String(v));
      if (!isNaN(d)) return d.toISOString().slice(0, 10);
    } catch {
      // noop
    }
    return String(v);
  };

  useEffect(() => {
    api.get("/affichageArchiveDepart")
        .then((res) => {
          console.log("Données reçues :", res.data);
          setCourriers(res.data); // On stocke les résultats dans un état pour les afficher
        })
        .catch((error) => {
          console.log(error);
        });
  }, []);

  // normalise et sécurise l'accès aux champs
  const normalize = (v) => (v === null || v === undefined ? "" : String(v));

  // memoize pour éviter de recalculer à chaque render (optionnel mais recommandé)
  const filtre = React.useMemo(() => {
      const p = filterDestinataireDepart.trim().toLowerCase();
      const n = filterNumero_Correspondance_Depart.trim().toLowerCase();
      const t = filterObjetDepart.trim().toLowerCase();
      const dEprt = filterDateDepart; // format attendu: "YYYY-MM-DD"
      const dCorr = filterDateCorrespondanceDepart;

    return courriers.filter((e) => {
      // sécurité : forcer valeurs en string / safe access
      const DestinataireDepart = normalize(e.DestinataireDepart).toLowerCase();
      const numero_correspondance_depart = normalize(e.numero_correspondance_depart).toLowerCase();
      // corrige l'orthographe si nécessaire : TexteCorrespondanceArrive
      const ObjetDepart = normalize(e.TexteCorespondanceArrive).toLowerCase();
    
      // comparer les dates après formatage uniforme (YYYY-MM-DD)
      const dateArr = formatDate(e.DateArrive); // utilise ta fonction formatDate
      const dateCorr = formatDate(e.DateCorrespondanceArrive);

      // tests
        if (p && !DestinataireDepart.includes(p)) return false;
        if (n && !numero_correspondance_depart.includes(n)) return false;
        if (t && !ObjetDepart.includes(t)) return false;
        if (dEprt && dateArr !== dEprt) return false;
        if (dCorr && dateCorr !== dCorr) return false;

      return true;
    });
  }, [courriers, filterDestinataireDepart, filterNumero_Correspondance_Depart, filterObjetDepart, filterDateDepart, filterDateCorrespondanceDepart]);

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* HEADER */}
      <header
        className={`fixed top-0 left-0 w-full z-40 flex items-center justify-between px-6 py-4 transition-colors duration-300 ${
          darkMode ? "bg-gray-800 text-gray-100 border-b border-gray-700" : "bg-indigo-900 text-white"
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
          <UserCircle size={40} className={`${darkMode ? "text-gray-100" : "text-white"}`} />
        </Link>
      </header>

      {/* LAYOUT */}
      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside
          className={`fixed h-full flex flex-col transition-all duration-300 pt-30 ${
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
                  <Mail size={18} /> {sidebarOpen && "Arriver du courrier"}
                </li>
                </Link>

                <Link to="/informationdepart">
                <li
                  className={`p-2 rounded-md cursor-pointer flex items-center gap-3 font-medium ${
                    darkMode
                      ? "hover:bg-gray-700 text-gray-200"
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
                        ? "hover:bg-gray-700 text-gray-200"
                        : "hover:bg-indigo-50 text-indigo-800"
                    }`}
                  >
                    <Grid size={18} /> {sidebarOpen && "Tableau de bord"}
                  </li>
                </Link>
              </ul>
            </div>

            {/* MES DOSSIERS */}
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

                  <li
                    className={`p-2 rounded-md cursor-pointer flex items-center gap-2 font-medium transition ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-200"
                        : "hover:bg-indigo-50 text-gray-800"
                    }`}
                  >
                    <Link
                      to="/dossiers-valider"
                      className="flex items-center gap-2 w-full"
                    >
                      <Folder size={18} /> {sidebarOpen && "Dossiers à valider"}
                    </Link>
                  </li>
                  <Link to="/dossiers-traites">
                    <li
                      className={`p-2 rounded-md cursor-pointer flex items-center gap-2 font-medium transition ${
                        darkMode
                          ? "hover:bg-gray-700 text-gray-200"
                          : "hover:bg-indigo-50 text-gray-800"
                        }`}
                      >
                        <Folder size={18} /> {sidebarOpen && "Dossiers traités"}
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
                  <li
                    className={`p-2 rounded-md cursor-pointer flex items-center gap-2 font-medium transition ${
                      darkMode
                        ? "hover:bg-gray-700 text-gray-200"
                        : "hover:bg-indigo-50 text-gray-800"
                    }`}
                  >
                    <Link
                      to="/dossiers-valides"
                      className="flex items-center gap-2 w-full"
                    >
                      <Folder size={18} /> {sidebarOpen && "Courriers validés"}
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
                      to="/dossiers-assignes"
                      className="flex items-center gap-2 w-full"
                    >
                      <Folder size={18} /> {sidebarOpen && "Courriers à dispatcher"}
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            {/* DOSSIERS DES DIVISIONS */}
              <div>
                <p
                  className={`font-semibold mt-3 ${
                    darkMode ? "text-indigo-300" : "text-indigo-800"
                  }`}
                >
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
                      currentPage === "Archives des courriers envoyés"
                        ? darkMode
                          ? "bg-indigo-900 text-indigo-200"
                          : "bg-indigo-100 text-indigo-800"
                        : darkMode
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
          </nav>
        </aside>

        {/* MAIN */}
        <main className={`flex-1 p-6 overflow-auto transition-all duration-300 pt-30 relative ${
            sidebarOpen ? "ml-64" : "ml-24"
            }`}>
          {/* BOUTON DARK MODE */}
          <div className="fixed bottom-4 right-4">
            <button
              onClick={toggleDarkMode}
              className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition"
              aria-label="toggle dark mode"
            >
              {darkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
          </div>

          {/* top actions */}
          <div className="flex flex-col lg:flex-row gap-4 items-start justify-between mb-4">
            <div className="flex gap-3 flex-wrap">
              <Link
                to="/dossiers-affectes"
                className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-indigo-100 border-indigo-100 text-indigo-800"
                } shadow-sm hover:shadow-md transition`}
              >
                <Info size={18} />
                <span className="font-medium">Informations</span>
              </Link>
            </div>
          </div>
          {/* Filtrage multi-critères */}
          <div className="flex flex-wrap gap-3 items-end mb-6">
            <input
              type="text"
              value={filterDestinataireDepart}
              onChange={(e) => setFilterDestinataireDepart(e.target.value)}
              placeholder="Destinataire"
              className={`px-3 py-2 border rounded-lg ${
                darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-900"
              }`}
            />
            <input
              type="text"
              value={filterNumero_Correspondance_Depart}
              onChange={(e) => setFilterNumero_Correspondance_depart(e.target.value)}
              placeholder="N° Correspondance"
              className={`px-3 py-2 border rounded-lg ${
                darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-900"
              }`}
  />
            <input
              type="text"
              value={filterObjetDepart}
              onChange={(e) => setFilterObjetDepart(e.target.value)}
              placeholder="Objet"
              className={`px-3 py-2 border rounded-lg ${
                darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-900"
              }`}
            />
            <div className="flex flex-col">
              <label className="text-2lg mb-1">
                Date d'arrivée
              </label>
              <input
                type="date"
                value={filterDateDepart}
                onChange={(e) => setFilterDateDepart(e.target.value)}
                className={`px-3 py-2 border rounded-lg ${
                  darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-900"
                }`}
              />
            </div>
            <div className="flex flex-col">
              <label className="text-2lg mb-1">
                Date de correspondance
              </label>
              <input
                type="date"
                value={filterDateCorrespondanceDepart}
                onChange={(e) => setFilterDateCorrespondanceDepart(e.target.value)}
                className={`px-3 py-2 border rounded-lg ${
                  darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-900"
                }`}
              />
            </div>
            <button onClick={reset} className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow hover:bg-indigo-700 transition">
              Réinitialiser
            </button>
          </div>

          {/* TABLE */}
          <div
            className={`rounded-xl shadow-lg overflow-hidden ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div
              className="p-6 border-b"
              style={{
                borderColor: darkMode
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(15,23,42,0.05)",
              }}
            >
              <h2
                className={`text-2xl font-semibold ${
                  darkMode ? "text-white" : "text-indigo-800"
                }`}
              >
                Listes des archives des courriers envoyés
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                ({filtre.length}) courriers archivés
              </p>
            </div>

            <div className="p-4 overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr
                    className={`${
                      darkMode
                        ? "bg-indigo-950 text-white"
                        : "bg-indigo-100 text-indigo-900"
                    }`}
                  >
                    <th className="px-4 py-3 text-center text-sm">N° d'enregistrement</th>
                    <th className="px-4 py-3 text-center text-sm">Date d' envoi</th>
                    <th className="px-4 py-3 text-center text-sm">Destinataire</th>
                    <th className="px-4 py-3 text-center text-sm">N° de la correspondance</th>
                    <th className="px-4 py-3 text-center text-sm">Nombre de pièces jointes</th>
                    <th className="px-4 py-3 text-center text-sm">Date de la correspondance</th>
                    <th className="px-4 py-3 text-center text-sm">Objet</th>
                    <th className="px-4 py-3 text-center text-sm w-36">Observations</th>
                    <th className="px-4 py-3 text-center text-sm w-36">État</th>
                  </tr>
                </thead>

                <tbody>
                  {filtre.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-6 text-center text-gray-500"
                      >
                        Aucun enregistrement trouvé.
                      </td>
                    </tr>
                  ) : (
                    filtre.map((item) => (
                      <tr
                        key={item.NumeroDepart}
                        className={`border-b ${
                          darkMode
                            ? "border-gray-700 hover:bg-gray-700"
                            : "hover:bg-indigo-50"
                        }`}
                      >
                        <td className="px-4 py-3 text-center text-sm">{item.NumeroDepart}</td>
                        <td className="px-4 py-3 text-center text-sm">{formatDate(item.DateDepart)}</td>
                        <td className="px-4 py-3 text-center text-sm">{item.DestinataireDepart}</td>
                        <td className="px-4 py-3 text-center text-sm">{item.numero_correspondance_depart}</td>
                        <td className="px-4 py-3 text-center text-sm">{item.nombre_pieces_jointes}</td>
                        <td className="px-4 py-3 text-center text-sm">{formatDate(item.DateCorrespondanceDepart)}</td>
                        <td className="px-4 py-3 text-center text-sm">{item.ObjetDepart}</td>
                        <td className="px-4 py-3 text-center text-sm">{item.ObservationsDepart}</td>
                        <td className="px-4 py-3 text-center text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              item.etat_depart === "Archivé"
                                ? "bg-red-200 text-red-800"
                                : "bg-yellow-200 text-yellow-800"
                            }`}
                          >
                            {item.etat_depart}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ArchivesDepart;
