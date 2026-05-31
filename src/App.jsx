import { useState, useEffect } from "react";
import LandingPage from "./pages/LandingPage";
import CitizenLogin from "./pages/CitizenLogin";
import AdminLogin from "./pages/AdminLogin";
import CitizenPortal from "./pages/CitizenPortal";
import AdminPortal from "./pages/AdminPortal";

export default function App() {
  const [screen, setScreen] = useState("landing");
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);

  // Restore session on reload
  useEffect(() => {
    const savedUser = localStorage.getItem("civicare_user");
    const savedRole = localStorage.getItem("civicare_role");
    if (savedUser && savedRole) {
      setUser(JSON.parse(savedUser));
      setRole(savedRole);
      setScreen(savedRole === "admin" ? "admin-portal" : "citizen-portal");
    }
  }, []);

  const handleCitizenLogin = (citizenData) => {
    setUser(citizenData);
    setRole("citizen");
    setScreen("citizen-portal");
  };

  const handleAdminLogin = (adminData) => {
    setUser(adminData);
    setRole("admin");
    setScreen("admin-portal");
  };

  const handleLogout = () => {
    localStorage.removeItem("civicare_user");
    localStorage.removeItem("civicare_role");
    setUser(null);
    setRole(null);
    setScreen("landing");
  };

  return (
    <>
      {screen === "landing"        && <LandingPage onCitizenLogin={() => setScreen("citizen-login")} onAdminLogin={() => setScreen("admin-login")} />}
      {screen === "citizen-login"  && <CitizenLogin onLoginSuccess={handleCitizenLogin} onBack={() => setScreen("landing")} />}
      {screen === "admin-login"    && <AdminLogin onLoginSuccess={handleAdminLogin} onBack={() => setScreen("landing")} />}
      {screen === "citizen-portal" && <CitizenPortal user={user} onLogout={handleLogout} />}
      {screen === "admin-portal"   && <AdminPortal user={user} onLogout={handleLogout} />}
    </>
  );
}