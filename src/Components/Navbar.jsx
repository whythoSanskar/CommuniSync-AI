import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-blue-600 py-4 shadow-lg fixed top-0 w-full z-10">
      <div className="container mx-auto flex justify-between items-center">
        <ul className="flex space-x-8">
          <li>
            <Link 
              to="/" 
              className="text-white text-lg font-semibold hover:text-gray-200 transition-colors duration-300"
            >
              CommuniSync
            </Link>
          </li>
          <li>
            <Link 
              to="/interview" 
              className="text-white text-lg font-semibold hover:text-gray-200 transition-colors duration-300"
            >
              Interview
            </Link>
          </li>
        </ul>

        <ul className="flex space-x-8">
          <li>
            <Link 
              to="/login" 
              className="text-white text-lg font-semibold px-4 py-2 bg-blue-700 rounded-md hover:bg-blue-800 transition-colors duration-300"
            >
              Get Started
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
