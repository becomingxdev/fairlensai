const Navbar = () => {
  return (
    <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Dashboard</h1>

      <button className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
        Logout
      </button>
    </div>
  );
};

export default Navbar;