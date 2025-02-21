
import { Link, useLocation } from "react-router-dom";
import { Calendar, Wallet, Heart } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="bg-white border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-8 h-16">
          <Link
            to="/"
            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
              location.pathname === "/"
                ? "border-purple-500 text-gray-900"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <Calendar className="w-4 h-4 mr-2" />
            Cronograma
          </Link>
          <Link
            to="/finances"
            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
              location.pathname === "/finances"
                ? "border-purple-500 text-gray-900"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <Wallet className="w-4 h-4 mr-2" />
            Finanças
          </Link>
          <Link
            to="/wishlist"
            className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
              location.pathname === "/wishlist"
                ? "border-purple-500 text-gray-900"
                : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
            }`}
          >
            <Heart className="w-4 h-4 mr-2" />
            Wishlist
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
