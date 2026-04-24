import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-900 text-white flex flex-col p-5">
      <h2 className="text-xl font-bold mb-8 text-center">FairLens AI</h2>

      <nav className="flex flex-col gap-4">
        <Link className="hover:bg-gray-700 p-2 rounded transition" to="/dashboard">Dashboard</Link>
        <Link className="hover:bg-gray-700 p-2 rounded transition" to="/upload">Upload</Link>
        <Link className="hover:bg-gray-700 p-2 rounded transition" to="/reports">Reports</Link>
        <Link className="hover:bg-gray-700 p-2 rounded transition" to="/recommendations">Recommendations</Link>
      </nav>
    </div>
  );
};

export default Sidebar;