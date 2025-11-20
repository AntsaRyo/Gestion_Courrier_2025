import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import ProtectedRoute from './ProtectedRoute'
import {RequireRole} from './RequireRole'
import { SidebarProvider } from "./pages/SideBarContext"
import { DarkModeProvider } from './pages/DarkModeContext'
import InscriptionFormPage from './pages/InscriptionFormPage'
import ModificationInfo from './pages/ModificationInfo'
import Connexion from './pages/Login'
import ProfilPage from './pages/ProfilPage'
import Accueil from './pages/Accueil'
import Informations from './pages/ListeCourriers'
import ModificationEnregistrement from './pages/ModificationEnregistrement'
import ModificationDepart from './pages/ModificationDepart'
import Enregistrement from './pages/Enregistrement'
import ObservationPage from './pages/ObservationPage'
import Assignation from './pages/Assignation'
import DashboardPage from './pages/Dashboard'
import DossiersAffectes from './pages/DossiersAffectés'
import DossiersValider from './pages/DossiersValider'
import ArchivesArrive from './pages/ArchivesArrive'
import ArchivesDepart from './pages/ArchivesDepart'
import DossiersDivisions from './pages/DossiersDivisions'
import DepartCourrier from './pages/DepartCourrier'
import EnregistrementDepart from './pages/EnregistrementDepart'
import DepartValider from './pages/DepartValider'
import CourriersAssigne from './pages/Assigne'
import BordereauEnvoi from './pages/BE'
import SoitTransmis from './pages/ST'
import DossiersSuivi from './pages/CourrierSuivi'
function App() {
  return (



    <DarkModeProvider>
      <SidebarProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Connexion />} />
            <Route path="/inscription-form" element={<InscriptionFormPage />} />

            {/*Route accessible à tous*/}
            <Route path="/accueil" element={<ProtectedRoute><Accueil /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
            <Route path="/profil" element={<ProtectedRoute><ProfilPage /></ProtectedRoute>} />
            <Route path="/modification-form" element={<ProtectedRoute><ModificationInfo /></ProtectedRoute>} />
            <Route path="/information" element={<ProtectedRoute><Informations /></ProtectedRoute>} />
            <Route path="/informationdepart" element={<ProtectedRoute><DepartCourrier /></ProtectedRoute>} />
            

            {/*Route pour la secretaire*/}
            <Route path="/enregistrementdepart" element={<ProtectedRoute><RequireRole allowed="Secretaire"><EnregistrementDepart /></RequireRole></ProtectedRoute>} />
            <Route path="/modification/:NumeroArrive" element={<ProtectedRoute><RequireRole allowed="Secretaire"><ModificationEnregistrement /></RequireRole></ProtectedRoute>} />
            <Route path="/modification_depart/:NumeroDepart" element={<ProtectedRoute><RequireRole allowed="Secretaire"><ModificationDepart /></RequireRole></ProtectedRoute>} />
            <Route path="/enregistrement" element={<ProtectedRoute><RequireRole allowed="Secretaire"><Enregistrement /></RequireRole></ProtectedRoute>} />
            <Route path="/dossiers-valides" element={<ProtectedRoute><RequireRole allowed="Secretaire"><DepartValider /></RequireRole></ProtectedRoute>} />
            <Route path="/archives-arrive" element={<ProtectedRoute><RequireRole allowed="Secretaire"><ArchivesArrive /></RequireRole></ProtectedRoute>} />
            <Route path="/archives-depart" element={<ProtectedRoute><RequireRole allowed="Secretaire"><ArchivesDepart /></RequireRole></ProtectedRoute>} />
            <Route path="/dossiers-divisions" element={<ProtectedRoute><RequireRole allowed="Secretaire"><DossiersDivisions /></RequireRole></ProtectedRoute>} />
            <Route path="/dossiers-assignes" element={<ProtectedRoute><RequireRole allowed="Secretaire"><CourriersAssigne /></RequireRole></ProtectedRoute>} />
            <Route path="/BE" element={<ProtectedRoute><RequireRole allowed="Secretaire"><BordereauEnvoi /></RequireRole></ProtectedRoute>} />
            <Route path="/ST" element={<ProtectedRoute><RequireRole allowed="Secretaire"><SoitTransmis /></RequireRole></ProtectedRoute>} />
            <Route path="/dossiers-suivis/:nomDivision" element={<ProtectedRoute><RequireRole allowed="Secretaire"><DossiersSuivi /></RequireRole></ProtectedRoute>} />

            {/*Route pour le chef service*/}
            <Route path="/dossiers-affectes" element={<ProtectedRoute><RequireRole allowed="Chef de service"><DossiersAffectes /></RequireRole></ProtectedRoute>} />
            <Route path="/observation/:NumeroArrive" element={<ProtectedRoute><RequireRole allowed="Chef de service"><ObservationPage /></RequireRole></ProtectedRoute>} />
            <Route path="/assignation/:NumeroArrive" element={<ProtectedRoute><RequireRole allowed="Chef de service"><Assignation /></RequireRole></ProtectedRoute>} />
            <Route path="/dossiers-valider" element={<ProtectedRoute><RequireRole allowed="Chef de service"><DossiersValider /></RequireRole></ProtectedRoute>} />
    
          </Routes>
      </Router>
    </SidebarProvider>
  </DarkModeProvider>
  )
}

export default App
