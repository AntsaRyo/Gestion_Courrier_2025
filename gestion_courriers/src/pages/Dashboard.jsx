import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import api from "../api";
import React, { useState, useContext, useEffect } from "react";
import { DarkModeContext } from "./DarkModeContext";
import { Link } from "react-router-dom";
import {
  Menu,
  Mail,
  Folder,
  BarChart2,
  Sun,
  Moon,
  UserCircle,
  Grid,
  Home,
  Calendar
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";
import logo from "../assets/mef.png";

const DashboardPage = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = localStorage.getItem("role");
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const currentPage = "Tableau de bord";
  const [totalArrive, setTotalArrive] = useState(0);
  const [totalDepart, setTotalDepart] = useState(0);
  const [envoye, setEnvoye] = useState(0);
  const [archive, setArchive] = useState(0);
  const [monthlyData, setMonthlyData] = useState([]);

useEffect(() => {

  Promise.all([
    api.get("/nombre_arrive"),
    api.get("/nombre_depart"), 
    api.get("/nombre_envoye"),
    api.get("/nombre_archive")
  ]).then(([arrive, depart, envoye, archive]) => {
    setTotalArrive(arrive.data.totalCourriersArrive);
    setTotalDepart(depart.data.totalCourriersDepart);
    setEnvoye(envoye.data.totalCourriersEnvoye);
    setArchive(archive.data.totalArchive);
  });

  //secretaire
  const fetchMonthlyData = async () => {
    try {
      const response = await api.get("/statistiques-mensuelles");
      const formattedData = response.data.map(item => ({
        month: new Date(item.month + '-01').toLocaleString("fr-FR", { month: 'short', year: 'numeric' }),
        recu: item.recu,
        envoye: item.envoye,
        dispatche: item.dispatche,
        archiveArrive: item.archiveArrive,
        archiveDepart: item.archiveDepart
      }));
      setMonthlyData(formattedData);
    } catch(error) {
      console.error("Erreur lors de la récupération des données mensuelles :", error);
    }
  };

  fetchMonthlyData();
}, []);

  const [totalValide, setTotalValide] = useState(0);
  const [totalAssigne, setTotalAssigne] = useState(0);
  const [monthlyData2, setMonthlyData2] = useState([]);

useEffect(() => {

  Promise.all([
    api.get("/total_valide"),
    api.get("/total_assignes"),
  ]).then(([valides, assignes]) => {
    setTotalValide(valides.data.totalCourriersDepart);
    setTotalAssigne(assignes.data.totalCourriersAssigne);
  });

  //secretaire
  const fetchMonthlyData2 = async () => {
    try {
      const response = await api.get("/statistiques-mensuelles-chef");
      const formattedData = response.data.map(item => ({
        month: new Date(item.month + '-01').toLocaleString("fr-FR", { month: 'short', year: 'numeric' }),
        valides: item.valides,
        assignes: item.assignes,
      }));
      setMonthlyData2(formattedData);
    } catch(error) {
      console.error("Erreur lors de la récupération des données mensuelles :", error);
    }
  };

  fetchMonthlyData2();
}, []);



  // --- Données fictives ---
  const stats = [
    { id: 1, label: "Courriers reçus", value: totalArrive, variation: "+4.2%", color: "#3B82F6" },
    { id: 2, label: "Courriers envoyés", value: totalDepart, variation: "-1.2%", color: "#C084FC" },
    { id: 3, label: "Courriers dispatchés", value: envoye, color: "#10B981" },
    { id: 4, label: "Courriers archivés", value: archive, color: "#b910a5ff" },
  ];

  const pieData = [
    { name: "Courriers reçus", value: totalArrive, color: "#3B82F6" },
    { name: "Courriers envoyés", value: totalDepart, color: "#C084FC" },
    { name: "Courriers dispatchés", value: envoye, color: "#10B981" },
    { name: "Courriers à archivés", value: archive, color: "#b910a5ff" },
  ];

  const pieData2 = [
    { name: "Courriers validés", value: totalValide, color: "#3B82F6" },
    { name: "Courriers assignés", value: totalAssigne, color: "#C084FC" },
  ];

  //rapport mensuel

  const [moisaisi, setMoisSaisi] = useState("");
  const [anneeSaisi, setAnneeSaisi] = useState("");

  const genererPDFMensuel = async () => {

    if (!moisaisi || moisaisi.length !== 7) {
      console.warn("Mois invalide :", moisaisi);
      return;
    }

    const moisLettre = new Date(moisaisi + "-01");
    const format = new Intl.DateTimeFormat("fr-FR", {
      month: "long",
      year: "numeric"
    });

    const moisFormat = format.format(moisLettre);
    const moisMaj = moisFormat.charAt(0).toUpperCase() + moisFormat.slice(1);

    if(!moisaisi) {
      alert("Saisissez un mois");
      return;
    }

    try {
      const { data } = await api.get(`/rapport-mensuel/${moisaisi}`);
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      doc.text(`Bureau du Secretariat de la SRB HM`, 170, 40);
      doc.text(`Rapport du mois : ${moisMaj}`, 40, 80  );
      autoTable(doc, {
        startY: 100,
        head: [["Reçus", "Envoyés", "Dispatchés", "Archives Arrivés", "Archives Départs"]],
        body: [[
          data.recu,
          data.envoye,
          data.dispatche,
          data.archiveArrive,
          data.archiveDepart
        ]],
        styles: { halign: 'center'}
      });
      doc.save(`rapport_${moisMaj}.pdf`);
      setMoisSaisi("");
      setModalOpen(false);
    } catch (error) {
      console.error(error);
      alert("Erreur d'exportation");
    }
  }
  const genererPDFAnnuel = async () => {

    if (!anneeSaisi || anneeSaisi.length !== 4) {
      console.warn("Année invalide :", anneeSaisi);
      return;
    }

    try {
      const { data } = await api.get(`/rapport-annuel/${anneeSaisi}`);
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      doc.text(`Bureau du Secretariat de la SRB HM`, 170, 40);
      doc.text(`Rapport de l'année : ${anneeSaisi}`, 40, 80  );

      const total = {
        recu: 0,
        envoye: 0,
        dispatche: 0,
        archiveArrive: 0,
        archiveDepart: 0,
      };

      const body = data.map(item => {
        total.recu += item.recu;
        total.envoye += item.envoye;
        total.dispatche += item.dispatche;
        total.archiveArrive += item.archiveArrive;
        total.archiveDepart += item.archiveDepart;

        return [
          item.mois,
          item.recu,
          item.envoye,
          item.dispatche,
          item.archiveArrive,
          item.archiveDepart
        ];
      });

      body.push([
        "TOTAL",
        total.recu,
        total.envoye,
        total.dispatche,
        total.archiveArrive,
        total.archiveDepart,
      ])

      autoTable(doc, {
          startY: 150,
          head: [["Mois", "Reçus", "Envoyés", "Dispatchés", "Archives Arrivés", "Archives Départs"]],
          body: body,
          didParseCell: (data) => {
              const rowIndex = data.row.index;
              const lastRowIndex = data.table.body.length - 1;

              if (rowIndex === lastRowIndex) {
                  data.cell.styles.fillColor = [142, 36, 170];
                  data.cell.styles.textColor = [255, 255, 255];
                  data.cell.styles.fontStyle = "bold";
              }
          },
          styles: { halign: "center" },
          headStyles: { fillColor: [52, 34, 153] }, // violet
          footStyles: { fillColor: [52, 34, 153] },
      });

      doc.save(`rapport_${anneeSaisi}.pdf`);
      setAnneeSaisi("");
      setModal3Open(false);
    } catch (error) {
      console.error(error);
      alert("Erreur d'exportation");
    }
  }

const genererPDFTrimestriel = async (num) => {

  if (!anneeSaisi || anneeSaisi.length !== 4) {
    alert("Veuillez saisir une année valide.");
    return;
  }

  try {
    const { data } = await api.get(`/rapport-trimestriel/${anneeSaisi}/${num}`);

    const doc = new jsPDF({ unit: "pt", format: "a4" });
    doc.text("Bureau du Secretariat de la SRB HM", 170, 40);
    doc.text(`Rapport du ${num}e trimestre ${anneeSaisi}`, 40, 80);

    const total = {
      recu: 0,
      envoye: 0,
      dispatche: 0,
      archiveArrive: 0,
      archiveDepart: 0,
    };

    const body = data.map(item => {
      total.recu += item.recu;
      total.envoye += item.envoye;
      total.dispatche += item.dispatche;
      total.archiveArrive += item.archiveArrive;
      total.archiveDepart += item.archiveDepart;

      return [
        item.mois.charAt(0).toUpperCase() + item.mois.slice(1),
        item.recu,
        item.envoye,
        item.dispatche,
        item.archiveArrive,
        item.archiveDepart
      ];
    });

    body.push([
      "TOTAL",
      total.recu,
      total.envoye,
      total.dispatche,
      total.archiveArrive,
      total.archiveDepart,
    ]);

    autoTable(doc, {
      startY: 150,
      head: [["Mois", "Reçus", "Envoyés", "Dispatchés", "Archives Arrivés", "Archives Départs"]],
      body: body,
      didParseCell: (data) => {
        const last = data.table.body.length - 1;
        if (data.row.index === last) {
          data.cell.styles.fillColor = [142, 36, 170];
          data.cell.styles.textColor = [255, 255, 255];
          data.cell.styles.fontStyle = "bold";
        }
      },
      styles: { halign: "center" },
      headStyles: { fillColor: [52, 34, 153] },
    });

    doc.save(`rapport_T${num}_${anneeSaisi}.pdf`);
    setModal2Open(false);
    setAnneeSaisi("");

  } catch (error) {
    console.error(error);
    alert("Erreur d'exportation");
  }
};


  const [modalOpen, setModalOpen] = useState(false);
  const [modal2Open, setModal2Open] = useState(false);
  const [modal3Open, setModal3Open] = useState(false);

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

      {/* LAYOUT */}
      <div className="flex flex-1">
        {/* SIDEBAR */}
        <aside
          className={`${
            sidebarOpen ? "w-64" : "w-24"
          } fixed h-full flex flex-col pt-30 transition-all duration-300 border-r ${
            darkMode
              ? "bg-gray-800 border-gray-700 text-gray-200"
              : "bg-white border-gray-200 text-gray-800"
          }`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-300 dark:border-gray-700">
            {sidebarOpen && <h2 className="font-semibold text-lg">Menu</h2>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
            >
              <Menu size={22} />
            </button>
          </div>

          <nav className="flex-1 px-3 py-4 text-sm space-y-4 overflow-y-auto">
            {/* Section principale */}
            <div>
              <ul className="space-y-2">
                <Link to="/accueil">
                  <li
                    className={`p-2 rounded-md cursor-pointer flex items-center gap-3 font-medium transition ${
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
                    className={`p-2 rounded-md cursor-pointer flex items-center gap-3 font-medium transition ${
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
                  className={`p-2 rounded-md cursor-pointer flex items-center gap-3 font-medium transition ${
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
                    className={`p-2 rounded-md cursor-pointer flex items-center gap-3 font-medium transition ${
                      currentPage === "Tableau de bord"
                        ? darkMode
                          ? "bg-indigo-900 text-indigo-200"
                        : "bg-indigo-100 text-indigo-800"
                        : darkMode
                          ? "hover:bg-gray-700 text-gray-100"
                          : "hover:bg-indigo-50 text-indigo-800"
                    }`}
                  >
                    <Grid size={18} /> {sidebarOpen && "Tableau de bord"}
                  </li>
                </Link>
              </ul>
            </div>
            
            {/* 🔹 Mes dossiers */}
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
                      className={`p-2 rounded-md cursor-pointer flex items-center gap-2 font-medium transition ${
                        darkMode
                          ? "hover:bg-gray-700 text-gray-200"
                          : "hover:bg-indigo-50 text-gray-800"
                      }`}
                    >
                      <Folder size={18} /> {sidebarOpen && "Dossiers à affecter"}
                    </li>
                  </Link>
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
                    <Folder size={18} /> {sidebarOpen && "Courriers à dispatcher"}
                  </Link>
                </li>
                </ul>
              </div>
            )}

            {/* Dossiers des divisions */}
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
                  <Link to="/dossiers-divisions">
                    <li
                      className={`p-2 rounded-md cursor-pointer flex items-center gap-2 font-medium transition ${
                        darkMode
                          ? "hover:bg-gray-700 text-gray-200"
                          : "hover:bg-indigo-50 text-gray-800"
                      }`}
                    >
                      <Folder size={18} /> {sidebarOpen && "Dossiers des divisions"}
                    </li>
                  </Link>
                  <Link to="/archives-arrive">
                    <li
                      className={`p-2 rounded-md cursor-pointer flex items-center gap-2 font-medium transition ${
                        darkMode
                          ? "hover:bg-gray-700 text-gray-200"
                          : "hover:bg-indigo-50 text-gray-800"
                      }`}
                    >
                      <Folder size={18} /> {sidebarOpen && "Archives des courriers arrivés"}
                    </li>
                  </Link>
                  <Link to="/archives-depart">
                    <li
                      className={`p-2 rounded-md cursor-pointer flex items-center gap-2 font-medium transition ${
                        darkMode
                          ? "hover:bg-gray-700 text-gray-200"
                          : "hover:bg-indigo-50 text-gray-800"
                      }`}
                    >
                      <Folder size={18} /> {sidebarOpen && "Archives des courriers envoyés"}
                    </li>
                  </Link>
                </ul>
              </div>
            )}
          </nav>
        </aside>

        {/*modal pour le rapport mensuel*/}
        {modalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div
              className={`p-10 rounded-2xl shadow-xl text-center ${
                darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
              }`}
            >
              <Calendar
                size={80}
                className="text-purple-500 mx-auto mb-4 animate-bounce"
              />

              <h3 className="text-2xl font-bold mb-2">
                Entrez le mois
              </h3>

              <input
                type="month"
                value={moisaisi}
                onChange={(e) => setMoisSaisi(e.target.value)}
                placeholder="Ex: Novembre"
                className={`px-3 py-2 border rounded-lg ${
                  darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-900"
                }`}
              />

              <div className="flex justify-center gap-4 my-3">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-900 transition"
                >
                  Annuler
                </button>

                <button
                  onClick={() => genererPDFMensuel()}
                  className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition"
                >
                  Génerer
                </button>
              </div>
            </div>
          </div>
        )}   

        {/*modal pour le rapport annuel*/}
        {modal3Open && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div
              className={`p-10 rounded-2xl shadow-xl text-center ${
                darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
              }`}
            >
              <Calendar
                size={80}
                className="text-purple-500 mx-auto mb-4 animate-bounce"
              />

              <h3 className="text-2xl font-bold mb-2">
                Entrez l'année
              </h3>

              <input
                type="number"
                min="2000"
                value={anneeSaisi}
                onChange={(e) => setAnneeSaisi(e.target.value)}
                placeholder="Ex: 2025"
                className={`px-3 py-2 border rounded-lg ${
                  darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-900"
                }`}
              />

              <div className="flex justify-center gap-4 my-3">
                <button
                  onClick={() => setModal3Open(false)}
                  className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-900 transition"
                >
                  Annuler
                </button>

                <button
                onClick={() => genererPDFAnnuel()}
                  className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition"
                >
                  Génerer
                </button>
              </div>
            </div>
          </div>
        )}   

        {/*modal pour le rapport trimestriel*/}
        {modal2Open && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
            <div
              className={`p-10 rounded-2xl shadow-xl text-center ${
                darkMode ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
              }`}
            >
              <Calendar
                size={80}
                className="text-purple-500 mx-auto mb-4 animate-bounce"
              />

              <h3 className="text-2xl font-bold mb-2">
                Entrez l'année
              </h3>

              <input
                type="number"
                min="2000"
                value={anneeSaisi}
                onChange={(e) => setAnneeSaisi(e.target.value)}
                placeholder="Ex: 2025"
                className={`px-3 py-2 border rounded-lg ${
                  darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-900"
                }`}
              />

              <h3 className="text-2xl font-bold mb-2">
                Choisissez le trimestre
              </h3>

              <div className="flex justify-center gap-4 my-3">
                <button
                    onClick={() => genererPDFTrimestriel(1)}
                    className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition"
                  >
                    1er trimestre
                </button>

                <button
                  onClick={() => genererPDFTrimestriel(2)}
                  className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition"
                >
                  2e trimestre
              </button>
              <button
                  onClick={() => genererPDFTrimestriel(3)}
                  className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition"
                >
                  3e trimestre
              </button>
              <button
                  onClick={() => genererPDFTrimestriel(4)}
                  className="px-6 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white transition"
                >
                  4e trimestre
              </button>
              </div>

              <div className="flex justify-center gap-4 my-3">
                <button
                  onClick={() => setModal2Open(false)}
                  className="px-6 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-900 transition"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}        

        {/* MAIN */}
        <main className={`flex-1 p-6 overflow-auto pt-30 transition-all duration-300 ${
            sidebarOpen ? "ml-64" : "ml-24"
          }`}>
          {/* Bouton clair/sombre */}
          <div className="fixed bottom-4 right-4 ">
            <button
              onClick={toggleDarkMode}
              className="bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition"
            >
              {darkMode ? <Sun size={22} /> : <Moon size={22} />}
            </button>
          </div>

          {/* TITRE */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">STATISTIQUES</h2>
          </div>

          {role === "Secretaire" && (
            <div className="flex gap-4 my-4">
              <button 
                onClick={() => { setModalOpen(true)}}
                className="flex items-center bg-purple-800 border-purple-800 text-gray-100 gap-3 px-4 py-2 rounded-xl border"
              >
                Export PDF Mensuel
              </button>

              <button 
                onClick={() => { setModal2Open(true)}}
                className="flex items-center bg-purple-800 border-purple-800 text-gray-100 gap-3 px-4 py-2 rounded-xl border"
              >
                Export PDF Trimestriel
              </button>

              <button 
                onClick={() => { setModal3Open(true)}}
                className="flex items-center bg-purple-800 border-purple-800 text-gray-100 gap-3 px-4 py-2 rounded-xl border"
              >
                Export PDF Annuel
              </button>
            </div>
          )}
          
          {/* CARTES + GRAPHIQUES */}
          {role === "Secretaire" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {stats.map((s) => (
                <div
                  key={s.id}
                  className={`p-5 rounded-xl shadow-md transition ${
                    darkMode ? "bg-gray-800 text-white" : "bg-white"
                  }`}
                >
                  <div className="flex flex-col items-center justify-center">
                    <BarChart2 size={30} color={s.color} />
                    <h3 className="text-3xl font-bold mt-2">{s.value}</h3>
                    <p className="text-sm text-gray-500">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {/* GRAPHIQUES */}
          {role === "Secretaire" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Pie Chart */}
              <div
                className={`p-6 rounded-xl shadow-md transition ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white"
                }`}
              >
                <h3 className="text-lg font-semibold mb-4">Diagramme</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      dataKey="value"
                      outerRadius={80}
                      label
                      cx="50%"
                      cy="50%"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="flex flex-wrap gap-3 justify-center mt-4">
                  {pieData.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Line Chart */}
              <div
                className={`p-6 rounded-xl shadow-md transition ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white"
                }`}
              >
                <h3 className="text-lg font-semibold mb-4">Evolution des courriers (3 derniers mois)</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <ComposedChart data={monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    {/* Barres : reçus et envoyés */}
                    <Bar dataKey="recu" name="Reçus" fill="#3B82F6" />
                    <Bar dataKey="envoye" name="Envoyés" fill="#C084FC" />
                    <Bar dataKey="dispatche" name="Dispatchés" fill="#10B981" />

                    {/* Lignes : traités et assignés */}
                    <Line type="monotone" dataKey="archiveArrive" name="Archives des arrivés" stroke="#b910a5ff" strokeWidth={2} />
                    <Line type="monotone" dataKey="archiveDepart" name="Archives des départs" stroke="#F59E0B" strokeWidth={2} />
                  </ComposedChart>   
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {role === "Chef de service" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 my-15">
              {/* Pie Chart */}
              <div
                className={`p-6 rounded-xl shadow-md transition ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white"
                }`}
              >
                <h3 className="text-lg font-semibold mb-4">Diagramme</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={pieData2}
                      dataKey="value"
                      outerRadius={80}
                      label
                      cx="50%"
                      cy="50%"
                    >
                        {pieData2.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>

                <div className="flex flex-wrap gap-3 justify-center mt-4">
                    {pieData2.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm">
                      <span
                        className="inline-block w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></span>
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Line Chart */}
              <div
                className={`p-6 rounded-xl shadow-md transition ${
                  darkMode ? "bg-gray-800 text-white" : "bg-white"
                }`}
              >
                <h3 className="text-lg font-semibold mb-4">Rapport d'activité des 3 derniers mois</h3>
                <ResponsiveContainer width="100%" height={260}>
                  <ComposedChart data={monthlyData2}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />

                    {/* Barres : reçus et envoyés */}
                    <Bar dataKey="valides" name="Validés" fill="#3B82F6" />
                    <Bar dataKey="assignes" name="Assignés" fill="#C084FC" />
                  </ComposedChart>   
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>

    
  );
};

export default DashboardPage;
