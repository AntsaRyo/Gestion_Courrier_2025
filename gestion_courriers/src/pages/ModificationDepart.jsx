import api from "../api";
import React, { useEffect,useState, useContext } from "react";
import { DarkModeContext } from "./DarkModeContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Menu,
  Mail,
  Folder,
  Sun,
  Moon,
  UserCircle,
  Grid,
  CheckCircle2,
  Home,
} from "lucide-react";
import logo from "../assets/mef.png";

const ModificationEnregistrement = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [success, setSuccess] = useState(false);
  const [isSubmiting , setIsSubmting] = useState(false);
  const [errors , setErrors] = useState();
  const navigate = useNavigate();
  const{NumeroDepart} = useParams();

  const [modifier, setModifier] = useState({
    DestinataireDepart: "",
    numero_correspondance_depart: "",
    DateCorrespondanceDepart: "",
    ObjetDepart: "",
    nombre_pieces_jointes: "",
    ObservationsDepart: "",
  });

  const currentPage = "Départ du courrier";

  // Soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmting(true);
    try {
      console.log(modifier);
      const response = await api.post(`/modification_depart/${NumeroDepart}`, modifier);
      console.log(response);
      setSuccess(true);
      setTimeout(() => {
        navigate("/informationDepart");
      }, 2500);
    } catch (error) {
        if(error.response.status===422){
          console.log(error);
          setErrors(error.response.data.message);
        } else{
            setErrors('Il y a quelque chose qui cloche');
        }
    } finally{
        setIsSubmting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setModifier((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    const fetchArrive = async () => {
      console.log("Paramètre reçu :", NumeroDepart);
      try {
        const response = await api.get(`/modifier_depart/${NumeroDepart}`);
        const data = response.data || {};
        console.log(data);
        setModifier({
          DestinataireDepart: data.DestinataireDepart || "",
          numero_correspondance_depart: data.numero_correspondance_depart || "",
          DateCorrespondanceDepart: data.DateCorrespondanceDepart ? data.DateCorrespondanceDepart.split("T")[0] : "",
          ObjetDepart: data.ObjetDepart || "",
          nombre_pieces_jointes: data.nombre_pieces_jointes || "",
          ObservationsDepart: data.ObservationsDepart || ""
        });
      } catch (err) {
        console.error('Failed to fetch courrier:', err);
        setErrors('Impossible de charger les informations du courrier');
      }
    };
    fetchArrive();
  }, [NumeroDepart]);

  return (
    <div
      className={`fixed top-0 left-0 w-full z-40 flex flex-col min-h-screen transition-colors duration-300 relative ${
        darkMode ? "bg-gray-900 text-gray-100" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* HEADER */}
      <header
        className={`flex items-center justify-between px-6 py-4 transition-colors duration-300 ${
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

      {/* LAYOUT */}
      <div className="flex flex-1 relative">
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
              <h2 className="font-semibold text-lg">Menu</h2>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
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
                    <Home size={18} />{" "}
                    {sidebarOpen && "Accueil"}
                  </li>
                </Link>
                <li
                  className={`p-2 rounded-md cursor-pointer flex items-center gap-3 font-medium ${
                      darkMode
                      ? "hover:bg-gray-700 text-gray-200"
                      : "hover:bg-indigo-50 text-indigo-800"
                  }`}
                >
                  <Mail size={18} /> {sidebarOpen && "Arriver du courrier"}
                </li>

                <Link to="/informationdepart">
                <li
                  className={`p-2 rounded-md cursor-pointer flex items-center gap-3 font-medium ${
                    currentPage === "Départ du courrier"
                      ? darkMode
                        ? "bg-indigo-900 text-indigo-200"
                        : "bg-indigo-100 text-indigo-800"
                      : darkMode
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
          </nav>
        </aside>

        {/* MAIN */}
        <main className="flex-1 p-6 overflow-y-auto h-[calc(100vh-64px)] relative">
          {/* Bouton dark mode */}
          <div className="absolute bottom-4 right-4 z-20">
            <button
              onClick={toggleDarkMode}
              className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition"
            >
              {darkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
          </div>

          {/* FORMULAIRE */}
          
          <div

            className={`rounded-xl shadow-lg overflow-hidden ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div
              className="p-6 border-b"
              style={{
                borderColor: darkMode
                  ? "rgba(255,255,255,0.04)"
                  : "rgba(15,23,42,0.03)",
              }}
            >
              <h2
                className={`text-3xl font-semibold text-center ${
                  darkMode ? "text-white" : "text-indigo-800"
                }`}
              >
                MODIFICATION ENREGISTREMENT
              </h2>
              <p className="text-sm text-gray-500 text-center mt-1">
                Mettez à jour les informations du courrier sélectionné.
              </p>
            </div>

            {errors &&
              <div className="alert alert-danger" >{errors}</div>}
            <form
              onSubmit={handleSubmit}
              className="p-6 grid grid-cols-1 md:grid-cols-2 gap-10"
            >

              <div className="flex flex-col">
                <label className="text-xl font-semibold mb-1">Destinataire</label>
                <input
                  type="text"
                  name="DestinataireDepart"
                  value={modifier.DestinataireDepart}
                  onChange={handleChange}
                  placeholder="Ex: Ministère de l'Économie"
                  className={`px-3 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xl font-semibold mb-1">
                  Numéro de la correspondance
                </label>
                <input
                  type="number"
                  min="0"
                  name="numero_correspondance_depart"
                  value={modifier.numero_correspondance_depart}
                  onChange={handleChange}
                  placeholder="Ex: CORR-2025-001"
                  className={`px-3 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xl font-semibold mb-1">
                  Date de la correspondance
                </label>
                <input
                  type="date"
                  name="DateCorrespondanceDepart"
                  value={modifier.DateCorrespondanceDepart}
                  onChange={handleChange}
                  className={`px-3 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xl font-semibold mb-1">Objet</label>
                <input
                  type="text"
                  name="ObjetDepart"
                  value={modifier.ObjetDepart}
                  onChange={handleChange}
                  placeholder="Objet du courrier"
                  className={`px-3 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-xl font-semibold mb-1">
                  Pièces jointes
                </label>
                <input
                  type="number"
                  min="0"
                  name="nombre_pieces_jointes"
                  value={modifier.nombre_pieces_jointes}
                  onChange={handleChange}
                  placeholder="Texte des pièces jointes"
                  className={`px-3 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } outline-none focus:ring-2 focus:ring-indigo-500`}
                />

              </div>
              <div className="flex flex-col">
                <label className="text-xl font-semibold mb-1">
                  Observations
                </label>
                <input
                  type="text"
                  name="ObservationsDepart"
                  value={modifier.ObservationsDepart}
                  onChange={handleChange}
                  placeholder="Observations"
                  className={`px-3 py-2 rounded-lg border ${
                    darkMode
                      ? "bg-gray-700 border-gray-600 text-gray-100"
                      : "bg-gray-50 border-gray-300 text-gray-900"
                  } outline-none focus:ring-2 focus:ring-indigo-500`}
                />
              </div>

              {/* Boutons */}
              <div className="col-span-1 md:col-span-2 flex flex-col items-center mt-6 gap-3">
                {isSubmiting ?
                <button
                  type="button"
                  className="bg-indigo-600 text-white w-100 px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Mise à jour...
                </button> 
                :
                <button
                  type="submit"
                  className="bg-indigo-600 text-white w-100 px-6 py-2 rounded-lg hover:bg-indigo-700 transition font-medium"
                >
                  Mettre à jour
                </button> }
                <Link to="/informationdepart">
                <button
                  className="bg-gray-200 text-black w-100 px-6 py-2 rounded-lg hover:bg-gray-300 font-medium"
                >
                  Annuler
                </button>
                </Link>
              </div>
            </form>
          </div>

          {/* Message de succès superposé */}
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
                <h2 className="text-2xl font-bold mb-2">
                  Modification enregistrée avec succès !
                </h2>
                <p className="text-gray-500 mb-6">
                  Vous serez redirigé vers la page d’informations.
                </p>
                <Link
                  to="/informationDepart"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Retourner maintenant
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ModificationEnregistrement;
