import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaUser, FaCode, FaEnvelope, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 50;
      setScrolled(isScrolled);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
          <span className="logo-text">
            <span className="logo-first">Iago</span>
            <span className="logo-second">Dev</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="navbar-menu">
          <li className="navbar-item">
            <Link 
              to="/" 
              className={`navbar-link ${isActive('/') ? 'active' : ''}`}
            >
              <FaHome className="nav-icon" />
              <span>INÍCIO</span>
            </Link>
          </li>
          <li className="navbar-item">
            <Link 
              to="/sobre" 
              className={`navbar-link ${isActive('/sobre') ? 'active' : ''}`}
            >
              <FaUser className="nav-icon" />
              <span>SOBRE</span>
            </Link>
          </li>
          <li className="navbar-item">
            <Link 
              to="/projetos" 
              className={`navbar-link ${isActive('/projetos') ? 'active' : ''}`}
            >
              <FaCode className="nav-icon" />
              <span>PROJETOS</span>
            </Link>
          </li>
          <li className="navbar-item">
            <Link 
              to="/contato" 
              className={`navbar-link ${isActive('/contato') ? 'active' : ''}`}
            >
              <FaEnvelope className="nav-icon" />
              <span>CONTATO</span>
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button className="mobile-menu-button" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <Link to="/" className="mobile-logo" onClick={closeMobileMenu}>
            <span className="logo-text">
              <span className="logo-first">Iago</span>
              <span className="logo-second">Dev</span>
            </span>
          </Link>
          <button className="mobile-close-button" onClick={closeMobileMenu}>
            <FaTimes />
          </button>
        </div>
        
        <ul className="mobile-menu-list">
          <li className="mobile-menu-item">
            <Link 
              to="/" 
              className={`mobile-menu-link ${isActive('/') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <FaHome className="mobile-nav-icon" />
              <span>INÍCIO</span>
            </Link>
          </li>
          <li className="mobile-menu-item">
            <Link 
              to="/sobre" 
              className={`mobile-menu-link ${isActive('/sobre') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <FaUser className="mobile-nav-icon" />
              <span>SOBRE</span>
            </Link>
          </li>
          <li className="mobile-menu-item">
            <Link 
              to="/projetos" 
              className={`mobile-menu-link ${isActive('/projetos') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <FaCode className="mobile-nav-icon" />
              <span>PROJETOS</span>
            </Link>
          </li>
          <li className="mobile-menu-item">
            <Link 
              to="/contato" 
              className={`mobile-menu-link ${isActive('/contato') ? 'active' : ''}`}
              onClick={closeMobileMenu}
            >
              <FaEnvelope className="mobile-nav-icon" />
              <span>CONTATO</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;