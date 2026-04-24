import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import UploadDataset from "./pages/UploadDataset";
import Reports from "./pages/Reports";
import Recommendations from "./pages/Recommendations";

function App() {
  return (
    <div className="h-screen w-full bg-gray-100">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadDataset />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/recommendations" element={<Recommendations />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;