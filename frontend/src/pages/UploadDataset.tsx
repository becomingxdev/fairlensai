import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const UploadDataset = () => {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Upload Dataset</h1>

          <input type="file" className="mb-4" />

          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadDataset;