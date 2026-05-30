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
import ScanResults from "./pages/ScanResults";
import FarmFinance from "./pages/FarmFinance";
import ForageMap from "./pages/ForageMap";

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
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
