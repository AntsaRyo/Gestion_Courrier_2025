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
  Trash2,
  Edit,
  UserCircle,
  Info,
  Save,
  Grid,
  Home,
  FileText,
  HelpCircle
} from "lucide-react";
import logo from "../assets/mef.png";

const DepartCourrier = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedCourrier, setSelectedCourrier] = useState(null); // ID sélectionné

  const currentPage = "Départ du courrier";
  const [courriers, setCourriers] = useState([]);

  // États pour les filtres
  const [filterDestinataireDepart, setFilterDestinataireDepart] = useState("");
  const [filterNumero_Correspondance_Depart, setFilterNumero_Correspondance_depart] = useState("");
  const [filterObjetDepart, setFilterObjetDepart] = useState("");
  const [filterDateCorrespondanceDepart, setFilterDateCorrespondanceDepart] = useState("");

  const reset = () => {
    setFilterDestinataireDepart("");
    setFilterNumero_Correspondance_depart("");
    setFilterObjetDepart("");
    setFilterDateCorrespondanceDepart("");
  }

   // Fonction pour sélectionner/désélectionner
  const handleRowClick = (courriers) => {
    setSelectedCourrier(selectedCourrier === courriers.NumeroDepart ? null : courriers);
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
      api.get("/affichage_depart")
        .then((res) => {
          console.log("Données reçues :", res.data);
          setCourriers(res.data); // On stocke les résultats dans un état pour les afficher
        })
        .catch((error) => {
          console.log(error);
        });
  }, []);

  //Modal suppression
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedNumero, setSelectedNumero] = useState(null);

    //fonction supprimer
    const supprimerCourrier = async () => {
      if (!selectedNumero) return;
      try {
        // Note: endpoint expects DELETE /supprimer_arrive/{NumeroArrive}
        await api.delete(`/supprimer_depart/${selectedNumero}`);
        setCourriers((prev) => prev.filter((c) => c.NumeroDepart !== selectedNumero));
        setModalOpen(false);
      } catch (error) {
        console.error('Erreur suppression courrier:', error);
        alert('Impossible de supprimer le courrier. Voir la console pour plus de détails.');
      }
    };

  // normalise et sécurise l'accès aux champs
  const normalize = (v) => (v === null || v === undefined ? "" : String(v));

  // memoize pour éviter de recalculer à chaque render (optionnel mais recommandé)
  const filtre = React.useMemo(() => {
    const p = filterDestinataireDepart.trim().toLowerCase();
    const n = filterNumero_Correspondance_Depart.trim().toLowerCase();
    const t = filterObjetDepart.trim().toLowerCase();
    const dCorr = filterDateCorrespondanceDepart;

    return courriers.filter((e) => {
      // sécurité : forcer valeurs en string / safe access
        const DestinataireDepart = normalize(e.DestinataireDepart).toLowerCase();
        const numero_correspondance_depart = normalize(e.numero_correspondance_depart).toLowerCase();
      // corrige l'orthographe si nécessaire : TexteCorrespondanceArrive
        const ObjetDepart = normalize(e.TexteCorespondanceArrive).toLowerCase();

      // comparer les dates après formatage uniforme (YYYY-MM-DD)
        const dateCorr = formatDate(e.DateCorrespondanceDepart);

        // tests
        if (p && !DestinataireDepart.includes(p)) return false;
        if (n && !numero_correspondance_depart.includes(n)) return false;
        if (t && !ObjetDepart.includes(t)) return false;
        if (dCorr && dateCorr !== dCorr) return false;

      return true;
    });
  }, [courriers, filterDestinataireDepart, filterNumero_Correspondance_Depart, filterObjetDepart, filterDateCorrespondanceDepart]);

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
            {role === "Chef de service" && (
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
                </ul>
              </div>
            )}

            {role === "Secretaire" && (
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
            {role === "Secretaire" && (
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

        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div
              className={`p-10 rounded-2xl shadow-xl text-center ${
                darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
              }`}
            >
              <Trash2
                size={80}
                className="text-red-500 mx-auto mb-4 animate-bounce"
              />

              <h2 className="text-2xl font-bold mb-2">
                Suppression
              </h2>

              <p className="text-gray-500 mb-6">
                Voulez-vous supprimer ce dossier ?
              </p>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-900 transition"
                >
                  Annuler
                </button>

                <button
                  onClick={supprimerCourrier}
                  className="px-6 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
                >
                  Valider
                </button>
              </div>
            </div>
          </div>
        )} 


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
                to="/information"
                className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-gray-100"
                    : "bg-indigo-100 border-indigo-100 text-indigo-800"
                } shadow-sm hover:shadow-md transition`}
              >
                <Info size={18} />
                <span className="font-medium">Informations</span>
              </Link>

              {role === "Secretaire" && (
                <Link
                  to="/enregistrementdepart"
                  className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 text-gray-100"
                      : "bg-white border-indigo-100 text-indigo-800"
                  } shadow-sm hover:shadow-md transition`}
                >
                  <Save size={18} />
                  <span className="font-medium">Enregistrer un départ</span>
                </Link>
              )}

              {/* Bouton PDF */}
              { role === "Secretaire" && (
                <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${
                    selectedCourrier
                      ? darkMode
                        ? "bg-gray-600 border-gray-600 text-gray-100"
                        : "bg-white border-indigo-100 text-indigo-800"
                      : "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
                  } shadow-sm hover:shadow-md transition`}>
                    
                  {selectedCourrier ? (
                    <Link to ="/BE "
                      state={{ courrier: selectedCourrier }}
                      className="flex items-center gap-2 py-2"
                    >
                      <FileText size={18} /> Générer BE
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2 py-2">
                      <FileText size={18} /> Générer BE
                    </div>
                  )}
                </div>
              )}
              {/* Bouton ST */}
              { role === "Secretaire" && (
                <div className={`flex items-center gap-3 px-4 py-2 rounded-xl border ${
                    selectedCourrier
                      ? darkMode
                        ? "bg-gray-600 border-gray-600 text-gray-100"
                        : "bg-white border-indigo-100 text-indigo-800"
                      : "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
                  } shadow-sm hover:shadow-md transition`}>
                    
                  {selectedCourrier ? (
                    <Link to ="/ST "
                      state={{ courrier: selectedCourrier }}
                      className="flex items-center gap-2 py-2"
                    >
                      <FileText size={18} /> Générer ST
                    </Link>
                  ) : (
                    <div className="flex items-center gap-2 py-2">
                      <FileText size={18} /> Générer ST
                    </div>
                  )}
                </div>
              )}
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
                Listes des courriers
              </h2>
              {role === "Chef de service" && (
                <p className="text-sm text-gray-500 mt-1">
                  Nombre de courrier. ({filtre.length}) <br />
                </p>
              )}

              {role === "Secretaire" && (
                <p className="text-sm text-gray-500 mt-1">
                  Nombre de courrier. ({filtre.length}) <br />
                  Sélectionnez un enregistrement puis appuyez sur le bouton <strong>"Générer BE"</strong> pour générer le Bordereau d'Envoi, 
                  sur <strong>"Générer ST"</strong> pour générer le Soit Transmis.
                </p>
              )}
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
                    <th className="px-4 py-3 text-center text-sm">Destinataire</th>
                    <th className="px-4 py-3 text-center text-sm">N° de la correspondance</th>
                    <th className="px-4 py-3 text-center text-sm">Nombre de pièces jointes</th>
                    <th className="px-4 py-3 text-center text-sm">Date de la correspondance</th>
                    <th className="px-4 py-3 text-center text-sm">Objet</th>
                    <th className="px-4 py-3 text-center text-sm">Observations</th>
                    <th className="px-4 py-3 text-center text-sm w-36">État</th>
                    { role === "Secretaire" && (
                      <th className="px-4 py-3 text-center text-sm">Actions</th>
                    )}
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
                        onClick={() => handleRowClick(item)}
                        className={`border cursor-pointer ${
                          darkMode
                            ? "border-gray-700 hover:bg-gray-700"
                            : "hover:bg-indigo-50"
                        } ${selectedCourrier?.NumeroDepart === item.NumeroDepart ? (darkMode ? "bg-indigo-900" : "bg-indigo-200") : ""}`}
                      >
                        <td className="px-4 py-3 text-center text-sm">{item.NumeroDepart}</td>
                        <td className="px-4 py-3 text-center text-sm">{item.DestinataireDepart}</td>
                        <td className="px-4 py-3 text-center text-sm">{item.numero_correspondance_depart}</td>
                        <td className="px-4 py-3 text-center text-sm">{item.nombre_pieces_jointes}</td>
                        <td className="px-4 py-3 text-center text-sm">{formatDate(item.DateCorrespondanceDepart)}</td>
                        <td className="px-4 py-3 text-center text-sm">{item.ObjetDepart}</td>
                        <td className="px-4 py-3 text-center text-sm whitespace-normal break-words w-55">{item.ObservationsDepart}</td>
                        <td className="px-4 py-3 text-center text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              item.etat_depart === "Non validé"
                                ? "bg-yellow-200 text-yellow-800"
                                : "bg-green-200 text-green-800"
                            }`}
                          >
                            {item.etat_depart}
                          </span>
                        </td>
                        { role === "Secretaire" && (
                          <td className="px-4 py-3 text-center">
                            <div className="flex items-center justify-center gap-3">
                              <Link to={`/modification_depart/${item.NumeroDepart}`}>
                                <button
                                  className="text-blue-600 hover:text-blue-800"
                                  aria-label="modifier"
                                >
                                  <Edit size={30} />
                                </button>
                              </Link>
                            </div>
                            <div className="flex items-center justify-center gap-3">
                                {role === "Secretaire" && (
                                  <button
                                  onClick={() => {
                                    setSelectedNumero(item.NumeroDepart);
                                    setModalOpen(true);
                                  }}
                                    className="text-red-600 hover:text-red-800"
                                  >
                                    <Trash2 size={30} />
                                  </button>
                                )}
                            </div>
                          </td>
                        )}
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

export default DepartCourrier;
