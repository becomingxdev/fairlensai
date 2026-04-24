import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <Navbar />

        <div className="p-6 bg-gray-100 flex-1">
          <h2 className="text-2xl font-bold mb-6">Welcome Back 👋</h2>

          <div className="grid grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded shadow hover:shadow-lg transition">
              <p className="text-gray-500">Total Uploads</p>
              <h3 className="text-xl font-bold">12</h3>
            </div>

            <div className="bg-white p-5 rounded shadow hover:shadow-lg transition">
              <p className="text-gray-500">Fairness Score</p>
              <h3 className="text-xl font-bold text-green-600">85%</h3>
            </div>

            <div className="bg-white p-5 rounded shadow hover:shadow-lg transition">
              <p className="text-gray-500">Reports</p>
              <h3 className="text-xl font-bold">5</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;