import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { WorkstationProvider } from "./context/WorkstationContext";
import Home from "./pages/Home";
import ScanViewfinder from "./pages/ScanViewfinder";
import ScanProcessing from "./pages/ScanProcessing";
import ObservationWorkspace from "./pages/ObservationWorkspace";
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
import ReptileGuide from "./pages/ReptileGuide";
import HoneyPlants from "./pages/HoneyPlants";
import FruitGuide from "./pages/FruitGuide";
import VerticalGarden from "./pages/VerticalGarden";
import InsectRepellent from "./pages/InsectRepellent";
import MarketPrices from "./pages/MarketPrices";
import AnimalTracks from "./pages/AnimalTracks";
import SurvivalPlants from "./pages/SurvivalPlants";
import NatureNavigation from "./pages/NatureNavigation";
import SpiderGuide from "./pages/SpiderGuide";
import MarineGuide from "./pages/MarineGuide";
import NocturnalGuide from "./pages/NocturnalGuide";
import AquaponicsGuide from "./pages/AquaponicsGuide";
import ForagingCalendar from "./pages/ForagingCalendar";
import WaterPurification from "./pages/WaterPurification";
import UVTracker from "./pages/UVTracker";
import RainfallPlanner from "./pages/RainfallPlanner";
import RepottingGuide from "./pages/RepottingGuide";
import LeafID from "./pages/LeafID";
import WildNutrition from "./pages/WildNutrition";
import FlowerID from "./pages/FlowerID";
import JungleMedicine from "./pages/JungleMedicine";
import BeekeepingGuide from "./pages/BeekeepingGuide";
import ShelterBuilder from "./pages/ShelterBuilder";
import SeedStarting from "./pages/SeedStarting";
import BonsaiGuide from "./pages/BonsaiGuide";
import WildBeeGuide from "./pages/WildBeeGuide";
import VermiGuide from "./pages/VermiGuide";
import GlobalMarketplace from "./pages/GlobalMarketplace";
import AboutFloraIQ from "./pages/AboutFloraIQ";
import AgriStoreFinder from "./pages/AgriStoreFinder";
import PlantAnatomy from "./pages/PlantAnatomy";
import CookingGuide from "./pages/CookingGuide";
import FarmDashboard from "./pages/FarmDashboard";
import LandMapper from "./pages/LandMapper";
import DroneView from "./pages/DroneView";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      {/* FSM pipeline: viewfinder → processing → observation workspace */}
      <Route path={"/scan"} component={ScanViewfinder} />
      <Route path={"/scan/processing"} component={ScanProcessing} />
      <Route path={"/scan/results/active"} component={ObservationWorkspace} />
      <Route path={"/scan/legacy"} component={Scan} />
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
      <Route path={"/reptiles"} component={ReptileGuide} />
      <Route path={"/honey"} component={HoneyPlants} />
      <Route path={"/fruits"} component={FruitGuide} />
      <Route path={"/vertical"} component={VerticalGarden} />
      <Route path={"/repellent"} component={InsectRepellent} />
      <Route path={"/market"} component={MarketPrices} />
      <Route path={"/tracks"} component={AnimalTracks} />
      <Route path={"/survivalplants"} component={SurvivalPlants} />
      <Route path={"/navigate"} component={NatureNavigation} />
      <Route path={"/spiders"} component={SpiderGuide} />
      <Route path={"/marine"} component={MarineGuide} />
      <Route path={"/nocturnal"} component={NocturnalGuide} />
      <Route path={"/aquaponics"} component={AquaponicsGuide} />
      <Route path={"/foragecal"} component={ForagingCalendar} />
      <Route path={"/waterpure"} component={WaterPurification} />
      <Route path={"/uv"} component={UVTracker} />
      <Route path={"/rainfall"} component={RainfallPlanner} />
      <Route path={"/repot"} component={RepottingGuide} />
      <Route path={"/leaf"} component={LeafID} />
      <Route path={"/nutrition"} component={WildNutrition} />
      <Route path={"/flower"} component={FlowerID} />
      <Route path={"/medicine"} component={JungleMedicine} />
      <Route path={"/beekeeping"} component={BeekeepingGuide} />
      <Route path={"/shelter"} component={ShelterBuilder} />
      <Route path={"/seeds"} component={SeedStarting} />
      <Route path={"/bonsai"} component={BonsaiGuide} />
      <Route path={"/wildbees"} component={WildBeeGuide} />
      <Route path={"/vermi"} component={VermiGuide} />
      <Route path={"/marketplace"} component={GlobalMarketplace} />
      <Route path={"/about"} component={AboutFloraIQ} />
      <Route path={"/agristore"} component={AgriStoreFinder} />
      <Route path={"/anatomy"} component={PlantAnatomy} />
      <Route path={"/cooking"} component={CookingGuide} />
      <Route path={"/farmtasks"} component={FarmDashboard} />
      <Route path={"/landmap"} component={LandMapper} />
      <Route path={"/droneview"} component={DroneView} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <WorkstationProvider>
        <ThemeProvider defaultTheme="dark">
          <TooltipProvider>
            <Toaster richColors position="top-center" />
            <Router />
            <Chatbot />
            <BottomNav />
          </TooltipProvider>
        </ThemeProvider>
      </WorkstationProvider>
    </ErrorBoundary>
  );
}

export default App;
