import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="bg-fuchsia-700 text-white py-6 shadow-md font-mono">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">Ahalya Traders</Link>        
      </div>
    </nav>
  );
};

export default Navbar;
