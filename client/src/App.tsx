import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Scan from "./pages/Scan";
import LandscapeIntelligence from "./pages/LandscapeIntelligence";
import SurvivalToolkit from "./pages/SurvivalToolkit";
import SpeciesMap from "./pages/SpeciesMap";
import FarmAssistant from "./pages/FarmAssistant";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import History from "./pages/History";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Chatbot from "./components/Chatbot";
import BottomNav from "./components/BottomNav";
import ScanResults from "./pages/ScanResults";
import FarmFinance from "./pages/FarmFinance";
import ForageMap from "./pages/ForageMap";
import WaterTracker from "./pages/WaterTracker";
import PlantJournal from "./pages/PlantJournal";
import DiseaseDiagnosis from "./pages/DiseaseDiagnosis";
import ToxicPlants from "./pages/ToxicPlants";
import ToolsHub from "./pages/ToolsHub";
import CompanionPlanting from "./pages/CompanionPlanting";
import PlantingCalendar from "./pages/PlantingCalendar";
import MoonCalendar from "./pages/MoonCalendar";
import FertilizerCalc from "./pages/FertilizerCalc";
import HerbGuide from "./pages/HerbGuide";
import BirdGuide from "./pages/BirdGuide";
import PestGuide from "./pages/PestGuide";
import IrrigationCalc from "./pages/IrrigationCalc";
import SoilGuide from "./pages/SoilGuide";
import CompostGuide from "./pages/CompostGuide";
import PropagationGuide from "./pages/PropagationGuide";
import EdiblePlants from "./pages/EdiblePlants";
import MedicinalPlants from "./pages/MedicinalPlants";
import MushroomGuide from "./pages/MushroomGuide";
import NaturalFirstAid from "./pages/NaturalFirstAid";
import OrganicPest from "./pages/OrganicPest";
import WildTea from "./pages/WildTea";
import CropRotation from "./pages/CropRotation";
import GrowthLog from "./pages/GrowthLog";
import ButterflyGarden from "./pages/ButterflyGarden";
import PruningGuide from "./pages/PruningGuide";
import HarvestCalc from "./pages/HarvestCalc";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/scan"} component={Scan} />
      <Route path={"/scan-results"} component={ScanResults} />
      <Route path={"/landscape"} component={LandscapeIntelligence} />
      <Route path={"/survival"} component={SurvivalToolkit} />
      <Route path={"/map"} component={SpeciesMap} />
      <Route path={"/farm"} component={FarmAssistant} />
      <Route path={"/login"} component={Login} />
      <Route path={"/signup"} component={Signup} />
      <Route path={"/history"} component={History} />
      <Route path={"/profile"} component={Profile} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/finance"} component={FarmFinance} />
      <Route path={"/forage"} component={ForageMap} />
      <Route path={"/water"} component={WaterTracker} />
      <Route path={"/journal"} component={PlantJournal} />
      <Route path={"/disease"} component={DiseaseDiagnosis} />
      <Route path={"/toxic"} component={ToxicPlants} />
      <Route path={"/tools"} component={ToolsHub} />
      <Route path={"/companion"} component={CompanionPlanting} />
      <Route path={"/calendar"} component={PlantingCalendar} />
      <Route path={"/moon"} component={MoonCalendar} />
      <Route path={"/fertilizer"} component={FertilizerCalc} />
      <Route path={"/herbs"} component={HerbGuide} />
      <Route path={"/birds"} component={BirdGuide} />
      <Route path={"/pest"} component={PestGuide} />
      <Route path={"/irrigation"} component={IrrigationCalc} />
      <Route path={"/soil"} component={SoilGuide} />
      <Route path={"/compost"} component={CompostGuide} />
      <Route path={"/propagation"} component={PropagationGuide} />
      <Route path={"/edible"} component={EdiblePlants} />
      <Route path={"/medicinal"} component={MedicinalPlants} />
      <Route path={"/mushroom"} component={MushroomGuide} />
      <Route path={"/firstaid"} component={NaturalFirstAid} />
      <Route path={"/organic"} component={OrganicPest} />
      <Route path={"/tea"} component={WildTea} />
      <Route path={"/rotation"} component={CropRotation} />
      <Route path={"/growth"} component={GrowthLog} />
      <Route path={"/butterfly"} component={ButterflyGarden} />
      <Route path={"/pruning"} component={PruningGuide} />
      <Route path={"/harvest"} component={HarvestCalc} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// Dark theme for FloraIQ - premium, scientific aesthetic
function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="dark"
      >
        <TooltipProvider>
          <Toaster />
          <Router />
          <Chatbot />
          <BottomNav />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
