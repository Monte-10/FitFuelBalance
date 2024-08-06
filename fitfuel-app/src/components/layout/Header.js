import React from 'react';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <header className="header d-flex align-items-center">
      <div className="container d-flex align-items-center justify-content-between">
        <Link to="/" className="logo d-flex align-items-center">
          {/* Logo */}
          <img src="/img/logo.png" alt="FitFuelBalance" />
          <span className="d-none d-lg-block">FitFuelBalance</span>
        </Link>

        <nav className="header-nav">
          <Link to="/nutrition" className="nav-link">Nutrition</Link>
          <Link to="/training" className="nav-link">Training</Link>
          {/* Otros enlaces */}
        </nav>
      </div>
    </header>
  );
}

export default Header;