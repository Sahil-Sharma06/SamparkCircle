import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { useNavigate } from 'react-router-dom';
import { FiMenu, FiX } from 'react-icons/fi';

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = React.useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <nav className="relative px-6 py-4 text-gray-200 bg-gray-900 shadow-lg bg-opacity-90 backdrop-blur-lg">
      <div className="flex items-center justify-between mx-auto max-w-7xl">
        <Link to="/" className="text-2xl font-semibold tracking-wide text-gray-100 transition hover:text-gray-300">
          SamparkCircle
        </Link>
        <div className="items-center hidden space-x-8 md:flex">
          <NavLink to="/" text="Home" />
          <NavLink to="/dashboard" text="Dashboard" />
          {user ? (
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-gray-300 transition-all duration-300 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700"
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink to="/login" text="Login" />
              <NavLink to="/signup" text="Sign Up" />
            </>
          )}
        </div>
        <button className="text-2xl text-gray-300 md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
      {menuOpen && (
        <div className="absolute left-0 w-full px-6 py-4 space-y-4 text-gray-200 bg-gray-900 top-full bg-opacity-95 md:hidden">
          <NavLink to="/" text="Home" onClick={() => setMenuOpen(false)} />
          <NavLink to="/dashboard" text="Dashboard" onClick={() => setMenuOpen(false)} />
          {user ? (
            <button
              onClick={() => {
                handleLogout();
                setMenuOpen(false);
              }}
              className="px-4 py-2 text-gray-300 transition-all duration-300 bg-gray-800 rounded-lg shadow-md hover:bg-gray-700"
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink to="/login" text="Login" onClick={() => setMenuOpen(false)} />
              <NavLink to="/signup" text="Sign Up" onClick={() => setMenuOpen(false)} />
            </>
          )}
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ to, text, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="text-lg text-gray-300 transition hover:text-gray-100"
  >
    {text}
  </Link>
);

export default Navbar;
