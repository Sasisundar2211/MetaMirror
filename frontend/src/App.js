import { BrowserRouter, Routes, Route } from "react-router-dom";
import "@/App.css";
import Landing from "./components/Landing";
import Onboarding from "./components/Onboarding";
import TherapySession from "./components/TherapySession";
import Dashboard from "./components/Dashboard";
import { Toaster } from "./components/ui/sonner";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/session" element={<TherapySession />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </div>
  );
}

export default App;