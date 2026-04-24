import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Recommendations = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Recommendations</h1>

          <div className="bg-white shadow p-4 rounded mb-3">
            Improve dataset balance
          </div>

          <div className="bg-white shadow p-4 rounded">
            Reduce gender bias influence
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;