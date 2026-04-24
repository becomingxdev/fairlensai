import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./contexts/ThemeContext";
import { AccessibilityProvider } from "./contexts/AccessibilityContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadDataset from "./pages/UploadDataset";
import Reports from "./pages/Reports";
import Recommendations from "./pages/Recommendations";
import Settings from "./pages/Settings";

function App() {
  return (
    <ThemeProvider>
      <AccessibilityProvider>
        <div className="h-screen w-full bg-gray-100 dark:bg-slate-950">
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Login />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<UploadDataset />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AccessibilityProvider>
    </ThemeProvider>
  );
}

export default App;