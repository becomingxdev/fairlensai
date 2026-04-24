import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const Reports = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Reports</h1>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-2">Report Name</th>
                <th className="p-2">Date</th>
                <th className="p-2">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-2">Sample Report</td>
                <td className="p-2">2026-04-24</td>
                <td className="p-2">
                  <button className="text-blue-500">Download</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;