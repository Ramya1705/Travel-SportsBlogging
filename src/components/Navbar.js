import { useContext, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaSignInAlt,
  FaSignOutAlt,
  FaUser,
  FaPlusCircle,
  FaCog,
  FaHome,
  FaPlane,
  FaFutbol,
  FaCompass,
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import './Navbar.css';

const navLinks = [
  { to: "/", text: "Home", icon: <FaHome className="nav-icon" /> },
  { to: "/travel", text: "Travel", icon: <FaPlane className="nav-icon" /> },
  { to: "/sports", text: "Sports", icon: <FaFutbol className="nav-icon" /> },
  { to: "/explore", text: "Explore", icon: <FaCompass className="nav-icon" /> },
];

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMobileMenu = () => setMenuOpen(false);

  const handleLogout = () => {
    logout();
    closeMobileMenu();
    setDropdownOpen(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const UserLinks = ({ isMobile = false }) => (
    <>
      <li>
        <Link
          to={`/profile/${user._id}`}
          className={isMobile ? "nav-link" : "dropdown-item"}
          onClick={() => {
            if (isMobile) closeMobileMenu();
            else setDropdownOpen(false);
          }}
        >
          <FaUser className="nav-icon" /> Edit Profile
        </Link>
      </li>
      <li>
        <Link
          to="/create-post"
          className={isMobile ? "nav-link" : "dropdown-item"}
          onClick={() => {
            if (isMobile) closeMobileMenu();
            else setDropdownOpen(false);
          }}
        >
          <FaPlusCircle className="nav-icon" /> Create Post
        </Link>
      </li>
      {user.role === "admin" && (
        <li>
          <Link
            to="/admin"
            className={isMobile ? "nav-link" : "dropdown-item"}
            onClick={() => {
              if (isMobile) closeMobileMenu();
              else setDropdownOpen(false);
            }}
          >
            <FaCog className="nav-icon" /> Admin
          </Link>
        </li>
      )}
      <li>
        <a
          href="#"
          onClick={handleLogout}
          className={isMobile ? "nav-link" : "dropdown-item"}
        >
          <FaSignOutAlt className="nav-icon" /> Logout
        </a>
      </li>
    </>
  );

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Sports & Travel Blog</Link>
      <button className="mobile-menu-icon" onClick={toggleMenu}>☰</button>

      {/* Desktop Navigation */}
      <ul className="desktop-nav-list">
        {navLinks.map((link) => (
          <li key={link.to} className="nav-item">
            <Link to={link.to} className="nav-link">
              {link.icon} {link.text}
            </Link>
          </li>
        ))}

        {user && user._id ? (
          <li className="nav-item dropdown" ref={dropdownRef}>
            <div
              className="profile-dropdown"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              <img
                src={
                  user.profilePicture
                    ? user.profilePicture
                    : `https://ui-avatars.com/api/?name=${(user.username || 'User').replace(/\s/g, '+')}&background=0D8ABC&color=fff`
                }
                alt="Profile"
                className="profile-avatar"
              />
              <ul className={`dropdown-menu ${dropdownOpen ? "show" : ""}`}>
                <UserLinks />
              </ul>
            </div>
          </li>
        ) : (
          <li className="nav-item">
            {!user && (
              <Link to="/login" className="nav-link">
                <FaSignInAlt className="nav-icon" /> Login
              </Link>
            )}
          </li>
        )}
      </ul>

      {/* Mobile Navigation */}
      <div className={`mobile-nav ${menuOpen ? "open" : ""}`}>
        <ul className="mobile-nav-list">
          {navLinks.map((link) => (
            <li key={link.to} className="nav-item">
              <Link
                to={link.to}
                className="nav-link"
                onClick={closeMobileMenu}
              >
                {link.icon} {link.text}
              </Link>
            </li>
          ))}

          <hr className="mobile-nav-divider" />

          {user && user._id ? (
            <UserLinks isMobile={true} />
          ) : (
            <li className="nav-item">
              <Link
                to="/login"
                className="nav-link"
                onClick={closeMobileMenu}
              >
                <FaSignInAlt className="nav-icon" /> Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
