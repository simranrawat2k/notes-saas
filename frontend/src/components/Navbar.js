import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.brand}>
        <h2 style={styles.logo}>Notes SaaS</h2>
      </div>
      <div style={styles.actions}>
        <button style={styles.button} onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 24px",
    backgroundColor: "#5C59E8",
    color: "white",
    flexWrap: "wrap", 
  },
  brand: {
    display: "flex",
    alignItems: "center",
  },
  logo: {
    margin: 0,
    fontSize: "20px",
    fontWeight: "600",
    letterSpacing: "0.5px",
  },
  actions: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "8px",
  },
  button: {
    backgroundColor: "white",
    color: "#5C59E8",
    fontWeight: "600",
    padding: "8px 16px",
    border: "none",
    borderRadius: "20px",
    cursor: "pointer",
    transition: "all 0.3s ease",
  },
};

styles.button[":hover"] = {
  backgroundColor: "#ecebff",
};

export default Navbar;
