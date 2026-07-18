import { NavLink } from "react-router-dom";
import "./BottomNav.css";

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/home" className="nav-icon">Home</NavLink>
      <NavLink to="/notifications" className="nav-icon">Alerts</NavLink>
      <NavLink to="/settings" className="nav-icon">Settings</NavLink>
    </nav>
  );
}
